require('dotenv').config();
const express = require("express");
const { ethers } = require("ethers");
const { JsonRpcProvider, Contract } = ethers;


const app = express();
app.use(express.json());
const provider = new JsonRpcProvider(process.env.ALCHEMY_URL);
const contractAddress = "0xB17F1a2C9a2737b219a4dDE2786E64A006bcb868";
const abi = [
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "string",
						"name": "hash",
						"type": "string"
					},
					{
						"indexed": false,
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
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
					}
				],
				"stateMutability": "view",
				"type": "function"
			}
		];

const contract = new Contract(contractAddress, abi, provider);

app.get("/verify/:hash", async (req, res) => {
    try {
        const { hash } = req.params;
        const result = await contract.verifyDocument(hash);
        
        res.json({
            exists: result[0],
            timestamp: result[1].toString(),
            owner: result[2]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/certify", async (req, res) => {
    try {
        const { hash } = req.body;
        if (!hash) {
            return res.status(400).json({ error: "O hash do documento é obrigatório." });
        }

        // Criando uma carteira a partir da chave privada
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contractWithSigner = contract.connect(wallet);

        // Enviar a transação para a blockchain
        const tx = await contractWithSigner.certifyDocument(hash);
        await tx.wait(); // Aguarda a transação ser confirmada

        res.json({
            message: "Documento certificado com sucesso!",
            transactionHash: tx.hash
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
