"use client";
import React, { useState, useEffect } from "react";
import "../styles/DocumentCRUD.css";
import axios from "axios";
import { escape } from "querystring";

// Definição da interface para o tipo de dado do documento
interface DocumentMetadata {
  id: string;
  certified_at: string;
  nome_documento: string;
  hash: string | null;
  transaction_id: string;
  classe: string;
  estudante: string;
  name_escola: string;
  user_id: string;
}

// Props que o componente DocumentCRUD aceitará
interface DocumentCRUDProps {
  onBackClick: () => void;
  //setisLoggedIn: Dispatch<SetStateAction<booleean>>;
}

const api = axios.create({
  baseURL: "http://localhost:8080", // URL do seu backend
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // Pega o token do armazenamento local antes de cada requisição
    const token = localStorage.getItem("authToken");
    if (token) {
      console.log("middle");
      // Adiciona o token ao cabeçalho Authorization no formato Bearer
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log("Erro middle");
    return Promise.reject(error);
  }
);

const DocumentCRUD: React.FC<DocumentCRUDProps> = ({
  onBackClick,
  //setisLoggedIn,
}) => {
  // Estado para armazenar a lista de documentos a ser exibida
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  // Estado para controlar a visibilidade do formulário (modal)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // Estado para armazenar o documento que está sendo editado (null se for um novo)
  const [editingDoc, setEditingDoc] = useState<DocumentMetadata | null>(null);

  // Estados para os filtros
  const [filterClasse, setFilterClasse] = useState<string>("");
  const [filterEstudante, setFilterEstudante] = useState<string>("");
  const [filterDoc, setFilterDoc] = useState<string>("");
  const [filterEscola, setFilterEscola] = useState<string>("");
  // Estado para gerenciar os dados do formulário de criação/edição
  const [formData, setFormData] = useState({
    id: "",
    certified_at: "",
    nome_documento: "",
    hash: "",
    transaction_id: "",
    classe: "",
    estudante: "",
    name_escola: "",
    user_id: "",
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      // Adiciona os parâmetros de filtro na URL da requisição
      const response = await api.get("/api/documents", {
        params: {
          classe: filterClasse,
          estudante: filterEstudante,
          nome_documento: filterDoc,
          escola: filterEscola,
        },
      });
      if (response.status === 403) {
        //isLoggedIn = ;
      }
      setDocuments(response.data);
      console.log(response.data);
    } catch (err) {
      console.error("Erro ao buscar documentos:", err);
      // Aqui você pode adicionar lógica para lidar com erros, como deslogar o usuário
      // se o erro for 401 Unauthorized (token inválido/expirado)
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        onBackClick(); // Exemplo: voltar para a página inicial
      }
    }
  };

  // Efeito para chamar a função de busca de documentos quando o componente é montado ou quando os filtros mudam // O array de dependências garante que a função será executada novamente

  // Handler para abrir o formulário em modo de criação
  const handleAddClick = () => {
    setEditingDoc(null);
    setFormData({
      id: "",
      certified_at: "",
      nome_documento: "",
      hash: "",
      transaction_id: "",
      classe: "",
      estudante: "",
      name_escola: "",
      user_id: "",
    });
    setIsModalOpen(true);
  };

  // Handler para abrir o formulário em modo de edição
  const handleEditClick = (doc: DocumentMetadata) => {
    setEditingDoc(doc);
    setFormData({
      id: doc.id,
      certified_at: doc.certified_at,
      nome_documento: doc.nome_documento,
      hash: "",
      transaction_id: doc.transaction_id,
      classe: doc.classe,
      estudante: doc.estudante,
      name_escola: doc.name_escola,
      user_id: doc.user_id,
    });
    setIsModalOpen(true);
  };

  const handleFilter = () => {
    fetchDocuments();
  };

  // Handler para o envio do formulário (criação ou atualização)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) {
      // Lógica de criacao
      const response = await api.post("/api/documents/create", {
        classe: formData.classe,
        estudante: formData.estudante,
        nome_documento: formData.nome_documento,
        hash: formData.hash,
        escola: formData.name_escola,
      });
      console.log(response);
      fetchDocuments();
      //setDocuments(updatedList);
      console.log("Documento Criado.");
    } else {
      // Lógica de atualizacao
      console.log("HASH EDICAO: " + formData.hash);
      const response = await api.put("/api/documents/update", {
        doc_id: formData.id,
        classe: formData.classe,
        estudante: formData.estudante,
        nome_documento: formData.nome_documento,
        hash: formData.hash,
        escola: formData.name_escola,
      });
      console.log(response);
      fetchDocuments();
      console.log("Documento atualizado.");
    }
    // // Fechar o modal após a operação
    setIsModalOpen(false);
  };

  // Handler para deletar um documento
  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Tem certeza que deseja deletar este documento?")) {
      const response = await api.delete(`/api/documents/delete/${id}`);
      console.log("Documento deletado:", id);
      console.log(response);
      fetchDocuments();
    }
  };

  return (
    <div className="crud-page-container">
      <div className="sidebar">
        <h3>Filtros</h3>
        <div className="filter-group">
          <label>
            Filtrar por Turma:
            <input
              type="text"
              value={filterClasse}
              onChange={(e) => setFilterClasse(e.target.value)}
              placeholder="Ex: ADS 3A"
            />
          </label>
        </div>
        <div className="filter-group">
          <label>
            Filtrar por Aluno:
            <input
              type="text"
              value={filterEstudante}
              onChange={(e) => setFilterEstudante(e.target.value)}
              placeholder="Ex: João da Silva"
            />
          </label>
        </div>
        <div className="filter-group">
          <label>
            Filtrar por Documento:
            <input
              type="text"
              value={filterDoc}
              onChange={(e) => setFilterDoc(e.target.value)}
              placeholder="Ex: Prova X"
            />
          </label>
        </div>
        <button onClick={handleFilter} className="button add-button">
          Filtrar
        </button>
      </div>
      <div className="document-crud-container">
        <h2>Gestão de Documentos Certificados</h2>

        <div className="header">
          <button onClick={handleAddClick} className="button add-button">
            Adicionar Novo Documento
          </button>
          <button onClick={onBackClick} className="button back-button">
            Voltar
          </button>
        </div>

        <table className="document-table">
          <thead>
            <tr>
              <th>Nome do Documento</th>
              <th>Turma</th>
              <th>Aluno</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {documents.length > 0 ? (
              documents.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.nome_documento}</td>
                  <td>{doc.classe}</td>
                  <td>{doc.estudante}</td>
                  <td className="action-buttons">
                    <button
                      onClick={() => handleEditClick(doc)}
                      className="button edit-button">
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteClick(doc.id)}
                      className="button delete-button">
                      Deletar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  style={{ textAlign: "center", padding: "20px" }}>
                  Nenhum documento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>
                {editingDoc ? "Editar Documento" : "Adicionar Novo Documento"}
              </h3>
              <form onSubmit={handleSubmit} className="form-container">
                <label>
                  Nome do Documento:
                  <input
                    type="text"
                    name="name"
                    placeholder={formData.nome_documento}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nome_documento: e.target.value,
                      })
                    }
                    required={!editingDoc}
                  />
                </label>
                <label>
                  Turma:
                  <input
                    type="text"
                    name="className"
                    placeholder={formData.classe}
                    onChange={(e) =>
                      setFormData({ ...formData, classe: e.target.value })
                    }
                    required={!editingDoc}
                  />
                </label>
                <label>
                  Nome do Aluno:
                  <input
                    type="text"
                    name="studentName"
                    placeholder={formData.estudante}
                    onChange={(e) =>
                      setFormData({ ...formData, estudante: e.target.value })
                    }
                    required={!editingDoc}
                  />
                </label>
                <label>
                  Hash do documento:
                  <input
                    type="text"
                    name="Hash"
                    placeholder={"Hash do documento."}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        hash: e.target.value,
                      });
                    }}
                    required={!editingDoc}
                  />
                </label>
                <label>
                  Escola:
                  <input
                    type="text"
                    name="name_escola"
                    placeholder={formData.name_escola}
                    onChange={(e) =>
                      setFormData({ ...formData, name_escola: e.target.value })
                    }
                    required={!editingDoc}
                  />
                </label>
                <div className="modal-footer">
                  <button type="submit" className="button submit-button">
                    {editingDoc ? "Salvar" : "Adicionar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="button cancel-button">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentCRUD;
