"use client";
import React, { useState } from "react";
import "../styles/Login.css";
import axios, { AxiosResponse } from "axios";

// Define a interface para as propriedades do componente de login
interface LoginProps {
  onLoginSuccess: (token: string) => void;
  onCancelClick: () => void;
}

type VerifyResponse = {
  response: string;
};

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onCancelClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Lógica de validação simples
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    // Aqui, você chamaria sua API de backend para autenticar o usuário.
    // Por enquanto, vamos simular uma autenticação bem-sucedida.
    try {
      // Lógica para chamar sua API de backend para registrar o usuário.
      // Exemplo de chamada com Axios (você precisaria instalar o axios)
      const response = await axios.post("http://localhost:8080/login", {
        email,
        password,
      });
      console.log();

      // Simulação de registro bem-sucedido
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Se o registro for bem-sucedido
      setTimeout(() => {
        // Se a autenticação for bem-sucedida, chame a prop onLoginSuccess
        // No seu TCC real, isso seria após a validação do backend
        onLoginSuccess(response.data.token);
      }, 1000);
    } catch (err) {
      setError("Ocorreu um erro no login. Por favor, tente novamente.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="button-container">
            <button type="submit" className="login-button primary-button">
              Entrar
            </button>
            <button
              type="button"
              className="login-button secondary-button"
              onClick={onCancelClick}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
