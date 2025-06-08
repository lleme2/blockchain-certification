import React from "react";

interface DownloadPrivateKeyProps {
  privateKeyPem: string; // A chave privada já no formato PEM
  fileName?: string; // Nome opcional para o arquivo de download
}

const DownloadPrivateKeyButton: React.FC<DownloadPrivateKeyProps> = ({
  privateKeyPem,
  fileName = "private_key.pem",
}) => {
  const handleDownload = () => {
    if (!privateKeyPem) {
      alert("A chave privada PEM está vazia. Não é possível fazer o download.");
      return;
    }

    // Cria um Blob (Binary Large Object) a partir da string PEM
    const blob = new Blob([privateKeyPem], { type: "application/x-pem-file" });

    // Cria um URL para o Blob
    const url = URL.createObjectURL(blob);

    // Cria um link temporário para iniciar o download
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName; // Define o nome do arquivo para download

    // Adiciona o link ao DOM, clica nele e depois remove
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Libera o URL do Blob para liberar memória
    URL.revokeObjectURL(url);

    alert(
      `Sua chave privada foi baixada como "${fileName}". Mantenha-a em segurança!`
    );
  };

  return (
    <button
      className="size_component2 mt-3"
      onClick={handleDownload}
      disabled={!privateKeyPem} // Desabilita o botão se a chave PEM estiver vazia
      style={{
        padding: "10px 15px",
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: privateKeyPem ? "pointer" : "not-allowed",
        fontSize: "16px",
      }}>
      Baixar Chave Privada
    </button>
  );
};

export default DownloadPrivateKeyButton;
