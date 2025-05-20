export default function Etapa3Verificacao() {
  return (
    <div className="card text-center shadow-sm p-4 card-etapa">
      <div className="etapa-numero">3</div>
      <h5 className="fw-bold mb-3">Verificar a autenticidade</h5>
      <input
        type="text"
        placeholder="Hash ou arquivo do documento"
        className="form-control mb-2 conteudo-topo mb-3"
      />
      <button className="btn btn-primary btn-sm w-100">Verificar</button>
    </div>
  );
}
