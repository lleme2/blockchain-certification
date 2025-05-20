import Grid1 from "./components/Grid1";
import TutorialWrapper from "./components/TutorialWrapper";

function App() {
  return (
    <>
      <h1 className="titulo-destaque mb-0">
        Certificação de Documentos com Blockchain: Aprenda e Experimente!
      </h1>
      <Grid1></Grid1>
      <div className="container py-5">
        <h2 className="fw-bold text-center mb-4">Tutorial Interativo</h2>
        <TutorialWrapper />
      </div>
    </>
  );
}

export default App;
