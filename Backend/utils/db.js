const { FallbackProvider } = require('ethers');
const mysql = require('mysql2');
require("dotenv").config();

// Configuração para a conexão com o banco de dados MySQL
const db = mysql.createPool({
  host: process.env.MYSQL_HOST, // Endereço do seu servidor MySQL
  user: process.env.MYSQL_USER,      // Nome de usuário do MySQL
  password: process.env.MYSQL_PASSWORD, // **Substitua 'sua_senha_aqui' pela sua senha real**
  database: process.env.MYSQL_DATABASE, // **Substitua 'nome_do_seu_banco' pelo nome do seu banco de dados**
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Exporta o pool de conexões para ser usado em outros arquivos
module.exports = db;