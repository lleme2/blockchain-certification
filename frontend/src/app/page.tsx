import Grid1 from "./components/Grid1";
import TutorialWrapper from "./components/TutorialWrapper";
import NavBar from "./components/NavBar";

const navLinks = [
  { label: "O que é blockchain?", href: "/about" },
  { label: "Funcionamente do tutorial", href: "/contact" },
];

function App() {
  return (
    <>
      <NavBar brand="BlockTuto" links={navLinks} />
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
