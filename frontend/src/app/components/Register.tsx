"use client";
import React, { useState } from "react";
import "../styles/Register.css";
import axios, { AxiosResponse } from "axios";

interface RegisterProps {
  onRegisterSuccess: (token: string) => void;
  onCancelClick: () => void;
}

const Register: React.FC<RegisterProps> = ({
  onRegisterSuccess,
  onCancelClick,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!name || !email || !password) {
      setError("Por favor, preencha todos os campos.");
      setIsLoading(false);
      return;
    }

    try {
      console.log(name);
      // Lógica para chamar sua API de backend para registrar o usuário.
      // Exemplo de chamada com Axios (você precisaria instalar o axios)
      const response = await axios.post("http://localhost:8080/register", {
        name,
        email,
        password,
      });

      // Simulação de registro bem-sucedido
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Se o registro for bem-sucedido
      onRegisterSuccess("teste");
    } catch (err) {
      setError("Ocorreu um erro no registro. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="register-container">
        <div className="register-box">
          <h2>Registre-se</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="name">Nome Completo</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            <div className="button-container">
              <button
                type="submit"
                className="register-button primary-button"
                disabled={isLoading}>
                {isLoading ? "Registrando..." : "Registrar"}
              </button>
              <button
                type="button"
                className="register-button secondary-button"
                onClick={onCancelClick}
                disabled={isLoading}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
