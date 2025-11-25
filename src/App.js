import React, { useState } from "react";
import "./App.css";

function App() {
  const [filaSP, setFilaSP] = useState([]);
  const [filaSE, setFilaSE] = useState([]);
  const [filaSG, setFilaSG] = useState([]);
  const [painel, setPainel] = useState([]);
  const [sequenciaSP, setSeqSP] = useState(1);
  const [sequenciaSE, setSeqSE] = useState(1);
  const [sequenciaSG, setSeqSG] = useState(1);
  const [ultimaChamada, setUltimaChamada] = useState("SG");

  const expedienteAtivo = () => {
    const hora = new Date().getHours();
    return hora >= 7 && hora < 17;
  };

  const gerarSenha = (tipo) => {
    if (!expedienteAtivo()) {
      alert("Expediente encerrado! Senhas não podem ser emitidas.");
      return;
    }

    const hoje = new Date();
    const YY = String(hoje.getFullYear()).slice(2);
    const MM = String(hoje.getMonth() + 1).padStart(2, "0");
    const DD = String(hoje.getDate()).padStart(2, "0");

    let seq = 0;
    if (tipo === "SP") seq = sequenciaSP;
    if (tipo === "SE") seq = sequenciaSE;
    if (tipo === "SG") seq = sequenciaSG;

    const SQ = String(seq).padStart(3, "0");
    const senha = `${YY}${MM}${DD}-${tipo}${SQ}`;

    if (tipo === "SP") {
      setFilaSP([...filaSP, senha]);
      setSeqSP(seq + 1);
    }
    if (tipo === "SE") {
      setFilaSE([...filaSE, senha]);
      setSeqSE(seq + 1);
    }
    if (tipo === "SG") {
      setFilaSG([...filaSG, senha]);
      setSeqSG(seq + 1);
    }
  };

  const simularTM = (tipo) => {
    if (tipo === "SP") return 15 + (Math.random() * 10 - 5);
    if (tipo === "SG") return 5 + (Math.random() * 6 - 3);
    if (tipo === "SE") return Math.random() < 0.95 ? 1 : 5;
  };

  const chamarSenha = () => {
    if (!expedienteAtivo()) {
      alert("Expediente encerrado! Chamadas não podem ser feitas.");
      return;
    }

    let chamada = null;

    if (ultimaChamada !== "SP" && filaSP.length > 0) {
      chamada = filaSP.shift();
      setFilaSP([...filaSP]);
      setUltimaChamada("SP");
    } else if (filaSE.length > 0) {
      chamada = filaSE.shift();
      setFilaSE([...filaSE]);
      setUltimaChamada("SE");
    } else if (filaSG.length > 0) {
      chamada = filaSG.shift();
      setFilaSG([...filaSG]);
      setUltimaChamada("SG");
    }

    if (chamada) {
      if (Math.random() <= 0.05) return; // 5% NÃO ATENDE

      simularTM(chamada.slice(8, 10)); // ignora, apenas simula

      const novaLista = [chamada, ...painel].slice(0, 5);
      setPainel(novaLista);
    }
  };

  return (
    <div className="container">
      <h1>Sistema de Controle de Atendimento</h1>

      <div className="content">

        <div className="bloco">
          <h2>Totem (Cliente)</h2>
          <button onClick={() => gerarSenha("SP")}>Prioritária (SP)</button>
          <button onClick={() => gerarSenha("SE")}>Exames (SE)</button>
          <button onClick={() => gerarSenha("SG")}>Geral (SG)</button>
        </div>

        <div className="bloco">
          <h2>Atendente (Guichê)</h2>
          <button onClick={chamarSenha}>Chamar Próxima</button>
        </div>

        <div className="bloco painel">
          <h2>Painel (Últimas 5 chamadas)</h2>
          {painel.length === 0 && <p>Nenhuma chamada ainda.</p>}
          {painel.map((item, i) => (
            <p key={i}>{item}</p>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;
