const jwt = require("jsonwebtoken");

// A chave secreta deve ser a mesma usada para assinar o token no endpoint de login
const JWT_SECRET = 'chave';

// Middleware para verificar o token JWT em cada requisição
const authenticateToken = (req, res, next) => {
    // 1. Extrai o cabeçalho de autorização da requisição
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato esperado: Bearer TOKEN

    // 2. Se o token não existir, retorna um erro 401 (Não Autorizado)
    if (token == null) {
        console.log("Token de autenticação ausente.")
        return res.status(401).json({ message: 'Token de autenticação ausente.' });
    }

    // 3. Verifica o token usando a chave secreta
    jwt.verify(token, JWT_SECRET, (err, user) => {
        // Se houver erro na verificação (token inválido ou expirado), retorna 403 (Proibido)
        if (err) {
            console.log("Token de autenticação inválido ou expirado.")
            return res.status(403).json({ message: 'Token de autenticação inválido ou expirado.' });
        }

        // 4. Se o token for válido, anexa o payload (com o userId) à requisição
        req.userId = user.userId;
        // 5. Chama o próximo middleware/função da rota
        next();
    });
};

module.exports = authenticateToken;