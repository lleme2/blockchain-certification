# Plataforma de Certificação Documental Acadêmica com Blockchain

## 📄 Descrição do Projeto

Este projeto de TCC apresenta uma **plataforma web inovadora para a certificação e verificação de documentos digitais utilizando a tecnologia blockchain**, com foco em instituições de ensino como faculdades e escolas. Nosso objetivo principal é resolver o problema da **autenticidade e integridade de documentos acadêmicos** (como certificados, diplomas, históricos e provas), combatendo fraudes e otimizando os processos de validação.

A aplicação permite que um usuário faça o upload de um documento, gere uma hash criptográfica única para ele e, através de uma assinatura digital, certifique a existência e integridade desse documento na blockchain. Além disso, a plataforma oferece a funcionalidade de verificar a validade de qualquer documento, bastando possuir sua hash, garantindo imutabilidade e rastreabilidade.

## ✨ Funcionalidades Principais

  * **Upload de Documentos:** Interface intuitiva para o upload de arquivos digitais.
  * **Geração de Hash Criptográfica:** Cálculo automático da hash SHA-256 do documento para garantir sua integridade.
  * **Geração de Par de Chaves:** Um par de chaves criptográficas (privada e pública) é gerado no navegador do usuário ao carregar o site.
  * **Assinatura Digital:** Capacidade de assinar a hash do documento digitalmente usando a chave privada gerada, vinculando a certificação ao usuário.
  * **Certificação em Blockchain:** Registro da hash do documento (e sua assinatura) na rede blockchain, tornando-o imutável e verificável.
  * **Verificação de Documentos:** Ferramenta para consultar a blockchain e verificar a autenticidade e integridade de um documento previamente certificado, utilizando sua hash.

## 💻 Tecnologias Utilizadas (Tech Stack)

A arquitetura da solução é dividida em Frontend, Backend e Interação com a Blockchain:

  * **Frontend:**
      * **React:** Biblioteca JavaScript para construção da interface de usuário reativa.
      * **TypeScript:** Superset do JavaScript que adiciona tipagem estática, melhorando a robustez e manutenibilidade do código.
      * **WebCrypto:** Utilizadas para a geração do par de chaves para a assinatura digital.
      * **Axios:** Interação com endpoints do backend.
      * **CSS:** Estilização dos componentes.
  * **Backend:**
      * **Node.js:** Ambiente de execução JavaScript do lado do servidor.
      * **Express.js:** Framework web para Node.js, facilitando a criação de APIs RESTful para comunicação com o frontend e a blockchain.
      * **Crypto:** Geração de hash dos documentos.
  * **Interação com Blockchain:**
      * **Ethers.js:** Bibliotecas JavaScript para interagir com a rede blockchain, enviar transações e ler dados de smart contracts.
      * **Ethereum Testnet (Sepolia):** Rede blockchain utilizada para o desenvolvimento e testes, garantindo um ambiente realista sem custos de transação reais.
      * **Solidity:** Linguagem de programação para o contrato inteligente (smart contract) que gerencia os registros de hash na blockchain.

## 🚀 Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente de desenvolvimento.

### Pré-requisitos

  * Node.js (versão LTS recomendada)
  * npm (gerenciador de pacotes do Node.js)
  * Git

### 1\. Clonar o Repositório

```bash
git clone https://github.com/lleme2/blockchain-certification
```

### 2\. Configurar o Backend

Navegue até a pasta do backend:

```bash
cd backend
npm install
```

Crie um arquivo `.env` na raiz da pasta `backend` com as variáveis de ambiente necessárias (ex: URL do nó da blockchain, chave privada de uma carteira de teste para deploy/interações se aplicável).

Exemplo de `.env`:

```
ALCHEMY_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY"
DATABASE_URL=YOUR_URL
CONTRACT_ADDR= "0xB7E61189e1d51B487d7A2C78b6e79d636F64FE4F"
PRIVATE_KEY=YOUR_WALLET_KEY

```

Inicie o servidor backend:

```bash
npm start
```

### 3\. Configurar o Frontend

Abra uma nova janela do terminal e navegue até a pasta do frontend:

```bash
cd frontend
npm install
```

Inicie a aplicação frontend:

```bash
npm run
```

A aplicação deverá abrir automaticamente no seu navegador padrão, geralmente em `http://localhost:3000`.

## 📈 Resultados Preliminares e Avaliação

Atualmente, o protótipo permite o upload de documentos, a geração da hash correspondente e a interação inicial para certificação e verificação. Os resultados preliminares demonstram a viabilidade técnica da integração entre o frontend React, o backend Node.js e a rede blockchain.

Planos para avaliação:

  * **Testes de Funcionalidade:** Assegurar que todas as operações (upload, hash, assinatura, certificação, verificação) funcionam conforme o esperado.
  * **Testes de Integridade:** Validar se a hash do documento original corresponde à hash verificada na blockchain.
  * **Testes de Segurança:** Avaliar a segurança da geração e manipulação das chaves criptográficas no cliente.
  * **Testes de Usabilidade:** Coletar feedback sobre a intuitividade da interface do usuário.
  * **Testes de Desempenho:** Medir o tempo de resposta das operações de certificação e verificação na blockchain.

## 🚀 Trabalhos Futuros

Este projeto serve como uma prova de conceito robusta. Para futuras iterações, propomos:

  * **Sistema de Gestão de Identidade:** Implementação de DIDs (Decentralized Identifiers) para gerenciamento de identidades de usuários e instituições na blockchain.
  * **Escalabilidade:** Exploração de soluções de Layer 2 (ex: Polygon, Arbitrum) ou outras redes blockchain para otimização de custos e performance.
  * **Recursos Adicionais:** Implementação de notificações de status de transação, histórico de documentos certificados por usuário.
  * **Testes de Carga:** Realização de testes de carga para avaliar o desempenho sob alta demanda.
  * **Piloto em Instituição Real:** Condução de um estudo de caso piloto em uma instituição de ensino para validação em um ambiente real.

## 👨‍💻 Autores

  * Lucas Lopes Leme - Desenvolvedor(a) e Pesquisador(a) Principal
