require("dotenv").config();
const express = require("express");
const { ethers, Wallet } = require("ethers");
const cors = require("cors");
const multer = require("multer");
const fs = require("node:fs");
const path = require('path');
const prisma = require('./lib/prisma');
const { JsonRpcProvider, Contract } = ethers;
const  generateFileHash = require("./utils/generateHash");
const { resourceUsage } = require("node:process");
const app = express();
app.use(cors());
app.use(express.json());

const provider = new JsonRpcProvider(process.env.ALCHEMY_URL);
const contractAddress = process.env.CONTRACT_ADDR;
const abi = [
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "string",
						"name": "hash",
						"type": "string"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "bytes",
						"name": "publicKey",
						"type": "bytes"
					},
					{
						"indexed": false,
						"internalType": "bytes",
						"name": "signature",
						"type": "bytes"
					}
				],
				"name": "DocumentCertified",
				"type": "event"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "_docHash",
						"type": "string"
					},
					{
						"internalType": "bytes",
						"name": "_publicKey",
						"type": "bytes"
					},
					{
						"internalType": "bytes",
						"name": "_signature",
						"type": "bytes"
					}
				],
				"name": "certifyDocument",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "",
						"type": "string"
					}
				],
				"name": "documents",
				"outputs": [
					{
						"internalType": "string",
						"name": "hash",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "bytes",
						"name": "publicKey",
						"type": "bytes"
					},
					{
						"internalType": "bytes",
						"name": "signature",
						"type": "bytes"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "_docHash",
						"type": "string"
					}
				],
				"name": "verifyDocument",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					},
					{
						"internalType": "bytes",
						"name": "publicKey",
						"type": "bytes"
					},
					{
						"internalType": "bytes",
						"name": "signature",
						"type": "bytes"
					}
				],
				"stateMutability": "view",
				"type": "function"
			}
		]
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new Contract(contractAddress, abi, wallet);
    const contractWithSigner = contract.connect(wallet);


app.post("/verify", async (req, res) => {
  try {
	const wallet = new Wallet(process.env.PRIVATE_KEY);
	console.log("Endereco da api: " + wallet.address);  
    const { hash, dado } = req.body;
    const result = await contractWithSigner.verifyDocument(hash);
    console.log(result)
    res.json({
      exists: result[0],
      timestamp: result[1].toString(),
      owner: result[2],
	  publicKey: result[3].toString(),
	  signature: result[4].toString(),
    });
  } catch (error) {
    const { hash } = req.params;
    console.log(hash)
    res.status(500).json({ error: error.message });
  }
});

app.post("/certify", async (req, res) => {
	
  try {
	const wallet = new Wallet(process.env.PRIVATE_KEY);
	console.log("Endereco da api: " + wallet.address);
    const { hash,signature,publicKey } = req.body;
    if (!hash || !signature || !publicKey) {
      return res
        .status(400)
        .json({ error: "Esta faltando alguma coisa." });
    }
    
    console.log(req.body)
    const tx = await contractWithSigner.certifyDocument(hash,publicKey,signature);
    await tx.wait();  
    res.json({
      message: "Documento certificado com sucesso!",
      transactionHash: tx.hash,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
});

const upload = multer({ dest: "./uploads/" });

async function dbCreate(hash,originalname,filepath,filename){
  let novoArquivo;
  let existente = await prisma.arquivo.findUnique({
    where: {
      hash: hash
    },
  });

  if (existente) {
    fs.unlink(filepath, (err) => {
        if (err) {
          console.error("Erro ao apagar o arquivo:", err);
          return;
        }
        console.log("Arquivo removido com sucesso.");
    });
    return null;
  }
  else{
    novoArquivo = await prisma.arquivo.create({
    data: {
      nomeOriginal: originalname,
      hash: hash,
      caminhoArquivo: filepath,
      certificado: false,
    },
  });
  }

  return novoArquivo;
}

app.post("/gerarHash", upload.single("file"), async (req, res) => {
  try {
    console.log("Arquivo recebido:", req.file);
    const filePath = path.join('./uploads/',req.file.filename)
    console.log(filePath)
    const hash = generateFileHash(filePath);
    console.log("Hash: " + hash + " Tipo: " + typeof(hash))
    const novoArquivo = dbCreate(hash,req.file.originalname,req.file.path,req.file.filename);
    res.json({ mensagem: "Arquivo recebido!", nome: req.file.originalname, hash: hash });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
});

app.get("/arquivos", async (req, res) => {
  try {
    const arquivos = await prisma.arquivo.findMany({
      orderBy: {
        dataUpload: "desc", // mais recentes primeiro (opcional)
      },
    });

    res.json(arquivos);
  } catch (error) {
    console.error("Erro ao buscar arquivos:", error);
    res.status(500).json({ erro: "Erro ao buscar arquivos" });
  }
});

app.get("/limpar",async (req,res) => {
  await prisma.arquivo.deleteMany();
});

const port = 8080;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
