require("dotenv").config();
const express = require("express");
const { ethers, Wallet } = require("ethers");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require("cors");
const multer = require("multer");
const fs = require("node:fs");
const path = require('path');
const prisma = require('./lib/prisma');
const { JsonRpcProvider, Contract } = ethers;
const  generateFileHash = require("./utils/generateHash");
const  authenticateToken = require("./utils/middle");
const processQueryWithLLM = require("./utils/llm_service")
const db = require('./utils/db');
const app = express();
const jwt = require('jsonwebtoken');
const { GoogleGenAI } = require("@google/genai");
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'chave';

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

app.post("/certifyMyKey", async (req, res) => {
	
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

let documents = [];

// GET /api/documents (READ)
    app.get("/api/documents", authenticateToken, async (req, res) => {
    const { userId } = req;
    const { classe, estudante, nome_documento } = req.query; // Pega os filtros da URL

    let query = "SELECT * FROM documentos WHERE user_id = ?";
    let params = [userId];

    if (classe) {
        const [results] = await db.promise().query('SELECT DISTINCT classe FROM documentos where user_id = ?;', [userId]);
        console.log("Resultados: " + results)
        const nomes = results.map(row => row.classe);
        console.log("Nomes: " + nomes)
        const llmResponse = await processQueryWithLLM(classe,nomes,1);
        console.log(Object.values(llmResponse))
        const nomesArray = JSON.parse(llmResponse);
        if(Object.keys(nomesArray).length > 0){
          query += " AND classe IN (?)";
          params.push(nomesArray);
        }
        else{
          console.log("Retorno vazio")
        }
    }

    if (estudante) {
        const [results] = await db.promise().query('SELECT DISTINCT estudante FROM documentos where user_id = ?;', [userId]);
        console.log("Resultados: " + results)
        const nomes = results.map(row => row.estudante);
        console.log("Nomes: " + nomes)
        const llmResponse = await processQueryWithLLM(estudante,nomes,1);
        console.log(Object.values(llmResponse))
        const estudantesArray = JSON.parse(llmResponse);
        console.log(estudantesArray)
        if(Object.keys(estudantesArray).length > 0){
          query += " AND estudante IN (?)";
          params.push(estudantesArray);
        }
        else{
          console.log("Retorno vazio")
        }
    }

    // Adiciona o filtro de busca por nome (busca por similaridade)
    if (nome_documento) {
        const [results] = await db.promise().query('SELECT DISTINCT nome_documento FROM documentos where user_id = ?;', [userId]);
        console.log("Resultados: " + results)
        const nomes = results.map(row => row.nome_documento);
        console.log("Nomes: " + nomes)
        const llmResponse = await processQueryWithLLM(nome_documento,nomes,1);
        const nomesArray = JSON.parse(llmResponse);
        console.log(typeof(nomesArray))
        if(Object.keys(nomesArray).length > 0){
          query += " AND nome_documento IN (?)";
          params.push(nomesArray);
        }
        else{
          console.log("Retorno vazio")
        }
    }
    console.log(query)
    console.log(params)

    db.query(query, params, (err, results) => {
        if (err) {
            console.error("Erro ao buscar documentos:", err);
            return res.status(500).send("Erro no servidor");
        }
        res.status(201).json(results);
    });
});

// POST /api/documents (CREATE)
app.post('/api/documents/create',authenticateToken ,(req, res) => {
    const { userId } = req;
    const { classe, estudante, nome_documento,hash,escola } = req.body;

    const query = "INSERT INTO documentos (`user_id`, `classe`, `estudante`, `nome_documento`, `hash`, `name_escola`) VALUES (?,?,?,?,?,?)";
    const params = [userId,classe, estudante, nome_documento,hash,escola];
    console.log(params)
    db.query(query, params, (err, results) => {
        if (err) {
            console.error("Erro ao criar documento:", err);
            return res.status(500).send("Erro no servidor");
        }
        res.status(201).json(results);
    });
});

// PUT /api/documents/:id (UPDATE)
app.put('/api/documents/update', authenticateToken,(req, res) => {
    const { userId } = req;
    const { classe, estudante, nome_documento,hash,escola,doc_id } = req.body;
    let params = [classe, estudante, nome_documento,hash,escola,userId.doc_id];
    let query = "UPDATE documentos SET classe = ?, estudante = ?, nome_documento = ?, hash = ?, name_escola = ? WHERE user_id = ? AND id = ?";
    if(!hash){
      console.log("hash nula")
       params = [classe, estudante, nome_documento,escola,userId,doc_id];
       query = "UPDATE documentos SET classe = ?, estudante = ?, nome_documento = ?, name_escola = ? WHERE user_id = ? AND id = ?";
    }
    else{
      console.log("hash nao nula: " + hash)
    }
    
    
    db.query(query, params, (err, results) => {
        if (err) {
            console.error("Erro ao criar documento:", err);
            return res.status(500).send("Erro no servidor");
        }
        res.status(201).json(results);
    });
});

// DELETE /api/documents/:id (DELETE)
app.delete('/api/documents/delete/:id', authenticateToken,(req, res) => {
    const { user_id } = req;
    const { id } = req.params;
    const query = "DELETE FROM documentos WHERE id = ?;"
    const params = [id,user_id];
    db.query(query, params, (err, results) => {
      if (err) {
            console.error('Erro ao deletar DOC:', err);
            return res.status(500).send('Erro no servidor');
        }
      res.status(201).json({ 
          message: 'Doc deletedo com sucesso!',
      });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    // 1. Query para buscar o usuário pelo e-mail
    const query = "SELECT * FROM users WHERE email = ?";
    const values = [email];

    db.query(query, values, async (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).send('Erro no servidor');
        }

        // 2. Verifica se o usuário foi encontrado
        if (results.length === 0) {
            return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
        }

        const user = results[0];

        // 3. Compara a senha fornecida com a hash do banco de dados
        try {
            const match = await bcrypt.compare(password, user.password_hash);

            if (match) {
                // 4. Se a senha corresponde, envia uma resposta de sucesso
                const token = jwt.sign(
                    { userId: user.id, email: user.email }, // Payload do token
                    JWT_SECRET,
                    { expiresIn: '1h' } // Token expira em 1 hora
                );
                //console.log(token)
                return res.status(200).json({ 
                    message: 'Login bem-sucedido!',
                    userId: user.id,
                    name: user.name,
                    token: token
                });
            } else {
                // 5. Se a senha não corresponde
                return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
            }
        } catch (bcryptErr) {
            console.error('Erro ao comparar senhas:', bcryptErr);
            return res.status(500).send('Erro no servidor');
        }
    });
});

app.post('/register', async (req,res) => {
	const { name, email, password } = req.body;

    // 2. Criar a hash da senha para armazenamento seguro
    // O '10' é o 'saltRounds', que determina a força da hash
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Query de INSERT com sanitização de dados (usando placeholders '?')
    const query = "INSERT INTO users (nome, email, password_hash) VALUES (?, ?, ?)";

    // 4. Array com os valores a serem inseridos, na ordem dos placeholders
    const values = [name, email, passwordHash];

    // 5. Executar a query no banco de dados
    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Erro ao registrar usuário:', err);
            // Verifica se o erro é de duplicidade de e-mail (ER_DUP_ENTRY)
            if (err.code === 'ER_DUP_ENTRY') {
                res.status(409).json({ message: 'Este e-mail já está em uso.' });
            } else {
                res.status(500).send('Erro no servidor');
            }
            return;
        }

        // 6. Resposta de sucesso
        res.status(201).json({ 
            message: 'Usuário registrado com sucesso!',
            userId: results.insertId
        });
    });
});


const port = 8080;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
