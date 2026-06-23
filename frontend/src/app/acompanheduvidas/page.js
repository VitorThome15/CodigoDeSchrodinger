"use client";
import { useState, useEffect } from "react";
import Navigation from '../components/navegation/navegation';
import MenuBar from '../components/menubar/menubar';

export default function AcompanheDuvidasPage() {
  const [minhasDuvidas, setMinhasDuvidas] = useState([]);
  
  const [abertas, setAbertas] = useState([]);
  const [editando, setEditando] = useState([]);
  const [novasDuvidas, setNovasDuvidas] = useState([]);
  const [respostas, setRespostas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function buscarDuvidas() {
      try {
        const userEmail = localStorage.getItem("userEmail") || "sem_email@sistema.com";
        const response = await fetch(`http://localhost:8080/api/help/user/${userEmail}`);
        
        if (!response.ok) throw new Error("Erro ao buscar dados do servidor");
        
        const data = await response.json();

        const duvidasFormatadas = data.map(item => ({
          id: item.id,
          texto: item.message,
          status: "em análise",
          resposta: "" 
        }));

        setMinhasDuvidas(duvidasFormatadas);
        setAbertas(Array(duvidasFormatadas.length).fill(false));
        setEditando(Array(duvidasFormatadas.length).fill(false));
        setNovasDuvidas(duvidasFormatadas.map(d => d.texto));
        setRespostas(Array(duvidasFormatadas.length).fill(""));

      } catch (error) {
        console.error("Erro ao carregar dúvidas:", error);
      } finally {
        setLoading(false);
      }
    }

    buscarDuvidas();
  }, []);

  const toggleAberta = idx => {
    setAbertas(prev => prev.map((aberta, i) => (i === idx ? !aberta : aberta)));
  };

  const handleEditar = idx => {
    setEditando(prev => prev.map((ed, i) => (i === idx ? !ed : ed)));
  };

const handleSalvarEdicao = async (idx) => {
    const idDaMensagem = minhasDuvidas[idx].id;
    const novoTexto = novasDuvidas[idx];

    // Lupa 1: Verifica no painel F12 (Console) se o ID está sendo capturado corretamente
    console.log("Enviando edição para o ID:", idDaMensagem);

    try {
      const response = await fetch(`http://localhost:8080/api/help/${idDaMensagem}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: novoTexto }),
      });

      if (!response.ok) {
        // Lupa 2: Captura a mensagem exata de erro que o Java enviou de volta
        const textoErro = await response.text();
        throw new Error(`Erro ${response.status}: ${textoErro}`);
      }

      const listaAtualizada = [...minhasDuvidas];
      listaAtualizada[idx].texto = novoTexto;
      
      setMinhasDuvidas(listaAtualizada);
      setEditando(prev => prev.map((ed, i) => (i === idx ? false : ed)));
      
      alert("Sua dúvida foi atualizada com sucesso!");

    } catch (error) {
      console.error("Erro detalhado ao salvar edição:", error);
      alert(`Não foi possível salvar: ${error.message}`);
    }
  };

  const handleResposta = idx => {
    alert("Resposta enviada: " + respostas[idx]);
    setRespostas(prev => prev.map((r, i) => (i === idx ? "" : r)));
  };

  return (
    <>
      <Navigation />
      <div style={{ minHeight: '100vh', background: '#fff', marginLeft: 220 }}>
        <MenuBar />
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: '80vh', paddingTop: 40 }}>
          <h1 style={{ marginBottom: 32, textAlign: 'center', width: '100%' }}>Acompanhe suas dúvidas</h1>
          
          <div style={{ width: '100%', maxWidth: 500 }}>
            {loading ? (
              <p style={{ textAlign: 'center', color: '#666' }}>Carregando suas dúvidas...</p>
            ) : minhasDuvidas.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666' }}>Você ainda não enviou nenhuma dúvida.</p>
            ) : (
              <ul style={{ width: '100%', padding: 0, listStyle: 'none', margin: 0 }}>
                {minhasDuvidas.map((d, i) => (
                  <li key={i} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #eee', padding: '16px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      {editando[i] && d.status === "em análise" ? (
                        <input
                          value={novasDuvidas[i]}
                          onChange={e => setNovasDuvidas(prev => prev.map((v, idx) => idx === i ? e.target.value : v))}
                          style={{
                            flex: 1,
                            fontSize: 16,
                            padding: 6,
                            borderRadius: 4,
                            border: '1px solid #ccc',
                            marginRight: 8
                          }}
                        />
                      ) : (
                        <button
                          onClick={() => toggleAberta(i)}
                          style={{
                            background: 'none',
                            border: 'none',
                            textAlign: 'left',
                            flex: 1,
                            color: '#222',
                            fontSize: 16,
                            cursor: 'pointer',
                            padding: 0
                          }}
                        >
                          {d.texto}
                        </button>
                      )}
                      <span style={{
                        color: d.status === "respondida" ? "#0a0" : "#f5a623",
                        fontWeight: 500,
                        fontSize: 14,
                        textTransform: 'capitalize',
                        marginLeft: 12
                      }}>
                        {d.status}
                      </span>
                      {d.status === "em análise" && (
                        <button
                          onClick={() => handleEditar(i)}
                          style={{
                            marginLeft: 12,
                            background: '#f5faff',
                            border: '1px solid #0070f3',
                            color: '#0070f3',
                            borderRadius: 4,
                            padding: '4px 10px',
                            fontSize: 14,
                            cursor: 'pointer'
                          }}
                        >
                          {editando[i] ? "Cancelar" : "Editar"}
                        </button>
                      )}
                    </div>
                    {editando[i] && d.status === "em análise" && (
                      <button
                        onClick={() => handleSalvarEdicao(i)}
                        style={{
                          alignSelf: 'flex-end',
                          marginTop: 6,
                          background: '#0070f3',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 4,
                          padding: '4px 14px',
                          fontSize: 14,
                          cursor: 'pointer'
                        }}
                      >
                        Salvar edição
                      </button>
                    )}
                    {abertas[i] && d.status === "respondida" && (
                      <div style={{ marginTop: 12, background: "#f6f6f6", borderRadius: 6, padding: 14 }}>
                        <div style={{ marginBottom: 10, color: "#222" }}>
                          <strong>Resposta:</strong> {d.resposta}
                        </div>
                        <div style={{ marginBottom: 8, color: "#555", fontWeight: 500 }}>
                          Ainda com dúvidas?
                        </div>
                        <textarea
                          placeholder="continue a conversa"
                          value={respostas[i]}
                          onChange={e => setRespostas(prev => prev.map((v, idx) => idx === i ? e.target.value : v))}
                          style={{
                            width: '100%',
                            minHeight: 50,
                            borderRadius: 6,
                            border: '1px solid #ccc',
                            padding: 8,
                            fontSize: 15,
                            marginBottom: 8
                          }}
                        />
                        <button
                          onClick={() => handleResposta(i)}
                          style={{
                            background: '#0070f3',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 4,
                            padding: '6px 18px',
                            fontSize: 15,
                            cursor: 'pointer'
                          }}
                        >
                          Responder
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </>
  );
}