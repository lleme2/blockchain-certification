"use client";
import React, { useState } from "react";
import TutorialWrapper from "./components/TutorialWrapper";
import DocumentCRUD from "./components/Crud";
import NavBar from "./components/NavBar";
import Login from "./components/login";
import Register from "./components/Register";

function App() {
  const AUTH_STORAGE_KEY = "authToken";
  // Use um estado para gerenciar a página atual do usuário.
  const [currentPage, setCurrentPage] = useState<string>("tutorial");
  // Novo estado para gerenciar o status de autenticação do usuário.
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Links para a barra de navegação. Inicia vazio.
  const navLinks = [];

  // Adiciona o link de "Meus Documentos" somente se o usuário estiver logado.
  if (isLoggedIn) {
    navLinks.push({ label: "Meus Documentos", href: "/crud" });
  }

  // Função para lidar com a navegação.
  const handleNavigation = (href: string) => {
    if (href === "/crud") {
      setCurrentPage("crud");
    } else {
      setCurrentPage("tutorial");
    }
  };

  // Funções para lidar com o login e logout.
  const handleLogin = () => {
    setCurrentPage("login");
  };

  const handleLoginSuccess = (token: string) => {
    console.log("Token que sera salvo: " + AUTH_STORAGE_KEY);
    localStorage.setItem(AUTH_STORAGE_KEY, token);
    setIsLoggedIn(true);
    setCurrentPage("tutorial");
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsLoggedIn(false);
    setCurrentPage("tutorial");
  };

  const handleVoltar = () => {
    setCurrentPage("tutorial");
  };

  const handleRegister = () => {
    console.log("Cliquei");
    setCurrentPage("register");
  };

  const handleRegisterSuccess = () => {
    console.log("Cliquei");
    setIsLoggedIn(false);
    setCurrentPage("register");
  };

  // Renderiza a página com base no estado 'currentPage' e 'isLoggedIn'.
  const renderPage = () => {
    if (!isLoggedIn && currentPage !== "login" && currentPage !== "register") {
      console.log("Entrei aqui 3");
      // Se não estiver logado e não estiver na página de login,
      // mostra apenas a página principal e o botão de login.
      return (
        <div className="container py-5">
          <h2 className="fw-bold text-center mb-4">
            Certifique ou valide seu documento
          </h2>
          <TutorialWrapper isLoggedIn={isLoggedIn} />
        </div>
      );
    }

    switch (currentPage) {
      case "tutorial":
        return (
          <div className="container py-5">
            <h2 className="fw-bold text-center mb-4">
              Certifique ou valide seu documento
            </h2>
            <TutorialWrapper isLoggedIn={isLoggedIn} />
          </div>
        );
      case "crud":
        return (
          <div className="container py-5">
            <h2 className="fw-bold text-center mb-4">
              Gestão de Documentos Certificados
            </h2>
            <DocumentCRUD
              onBackClick={handleVoltar}
              //setisLoggedIn={setIsLoggedIn}
            />
          </div>
        );
      case "login":
        console.log("Entrei aqui 2");
        return (
          <div className="container py-5">
            <Login
              onLoginSuccess={handleLoginSuccess}
              onCancelClick={handleLogout}
            />
          </div>
        );
      case "register":
        console.log("Entrei aqui");
        return (
          <div className="container py-5">
            <h2 className="fw-bold text-center mb-4">Página de Registro</h2>
            <Register
              onRegisterSuccess={handleLoginSuccess}
              onCancelClick={handleLogout}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <NavBar
        links={navLinks}
        onLinkClick={handleNavigation}
        onLoginClick={handleLogin}
        onRegisterClick={handleRegister}
      />
      {renderPage()}
    </>
  );
}

export default App;
