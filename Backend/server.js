require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");
const multer = require("multer");
const fs = require("node:fs");
const path = require('path');
const prisma = require('./lib/prisma');
const { JsonRpcProvider, Contract } = ethers;
const  generateFileHash = require("./utils/generateHash");

const app = express();
app.use(cors());
app.use(express.json());
const provider = new JsonRpcProvider(process.env.ALCHEMY_URL);
const contractAddress = process.env.CONTRACT_ADDR;
const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "hash",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "DocumentCertified",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_docHash",
        type: "string",
      },
    ],
    name: "certifyDocument",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "documents",
    outputs: [
      {
        internalType: "string",
        name: "hash",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_docHash",
        type: "string",
      },
    ],
    name: "verifyDocument",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const contract = new Contract(contractAddress, abi, provider);

app.get("/verify/:hash", async (req, res) => {
  try {
    const { hash } = req.params;
    const result = await contract.verifyDocument(hash);

    res.json({
      exists: result[0],
      timestamp: result[1].toString(),
      owner: result[2],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/certify", async (req, res) => {
  try {
    const { hash } = req.body;
    if (!hash) {
      return res
        .status(400)
        .json({ error: "O hash do documento é obrigatório." });
    }

    // Criando uma carteira a partir da chave privada
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contractWithSigner = contract.connect(wallet);

    // Enviar a transação para a blockchain
    const tx = await contractWithSigner.certifyDocument(hash);
    await tx.wait(); // Aguarda a transação ser confirmada

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
