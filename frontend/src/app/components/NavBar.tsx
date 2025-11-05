"use client";
import React from "react";
import "../styles/NavBar.css"; // Importa o arquivo CSS para estilização

// Define a interface para as propriedades do link
interface NavLink {
  label: string;
  href: string;
}

// Define a interface para as propriedades do NavBar
interface NavBarProps {
  links: NavLink[];
  onLinkClick: (href: string) => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({
  links,
  onLinkClick,
  onLoginClick,
  onRegisterClick,
}) => {
  return (
    <>
      <nav className="navbar">
        <div className="nav-links">
          {links.map((link) => (
            <a
              key={link.href}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onLinkClick(link.href);
              }}
              className="nav-link">
              {link.label}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          {}
          <button onClick={onRegisterClick} className="button register-button">
            Registre-se
          </button>
          {}
          <button onClick={onLoginClick} className="button login-button">
            Login
          </button>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
