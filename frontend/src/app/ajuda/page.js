"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from '../components/navegation/navegation';
import MenuBar from '../components/menubar/menubar';

const duvidas = [
  {
    pergunta: "Onde posso realizar cadastros?",
    resposta: "Você pode realizar cadastros acessando o menu principal e selecionando a opção de cadastro desejada."
  },
  {
    pergunta: "Errei um dado e o cadastrei no sistema, o que fazer?",
    resposta: "Procure a opção de edição ou exclusão do cadastro na tela correspondente. Caso não encontre, entre em contato com o suporte."
  }
];

export default function AjudaPage() {
  const [abertas, setAbertas] = useState(Array(duvidas.length).fill(false));
  const [novaDuvida, setNovaDuvida] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [showMensagem, setShowMensagem] = useState(false);
  const [loading, setLoading] = useState(false); // Novo estado para controle de envio
  const router = useRouter();

  const toggleDuvida = (idx) => {
    setAbertas((prev) =>
      prev.map((open, i) => (i === idx ? !open : open))
    );
  };

  const handleEnviar = async () => {
    if (novaDuvida.trim() !== "") {
      setLoading(true);

      try {
        // Puxa o nome e e-mail do usuário logado na memória do navegador
        // Se por acaso não achar, usa um valor padrão
        const userName = localStorage.getItem("username") || "Usuário Desconhecido";
        const userEmail = localStorage.getItem("userEmail") || "sem_email@sistema.com";

        // Puxa o token salvo no login 
        const token = localStorage.getItem("token") || ""; 

        const response = await fetch("http://localhost:8080/api/help", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // <--- Enviando a "chave" de acesso
          },
          body: JSON.stringify({
            name: userName,
            email: userEmail,
            message: novaDuvida
          }),
        });

        if (!response.ok) {
          throw new Error("Falha ao enviar para o servidor.");
        }

        setMensagem("Dúvida registrada com sucesso! Logo responderemos.");
        setNovaDuvida("");
        setShowMensagem(true);
        setTimeout(() => setShowMensagem(false), 4000);

      } catch (error) {
        console.error("Erro:", error);
        setMensagem("Erro ao enviar a dúvida. Tente novamente mais tarde.");
        setShowMensagem(true);
        setTimeout(() => setShowMensagem(false), 4000);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseMensagem = () => {
    setShowMensagem(false);
  };

  const handleAcompanhar = () => {
    router.push("/acompanheduvidas");
  };

  return (
    <>
      <Navigation />
      <div style={{ minHeight: '100vh', background: '#fff', marginLeft: 220 }}>
        <MenuBar />
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <h1 style={{ marginBottom: 32, textAlign: 'center', width: '100%' }}>Qual a sua dúvida?</h1>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', maxWidth: 500 }}>
            <h2 style={{ marginBottom: 12, textAlign: 'left' }}>Dúvidas frequentes</h2>
            <ul style={{ textAlign: 'left', marginBottom: 32, width: '100%', padding: 0, listStyle: 'none' }}>
              {duvidas.map((duvida, idx) => (
                <li key={duvida.pergunta} style={{ marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
                  <button
                    onClick={() => toggleDuvida(idx)}
                    style={{
                      background: 'none',
                      border: 'none',
                      width: '100%',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 16,
                      cursor: 'pointer',
                      padding: 0,
                      outline: 'none'
                    }}
                  >
                    <span style={{ flex: 1, color: '#222' }}>{duvida.pergunta}</span>
                    <span style={{ marginLeft: 8, transition: 'transform 0.2s', transform: abertas[idx] ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      ▼
                    </span>
                  </button>
                  {abertas[idx] && (
                    <div style={{ marginTop: 8, color: '#444', fontSize: 15 }}>
                      {duvida.resposta}
                    </div>
                  )}
                </li>
              ))}
            </ul>
            {/* Campo para enviar dúvida */}
            <div style={{ width: '100%', marginTop: 20 }}>
              <h2 style={{ fontSize: 20, marginBottom: 12 }}>Nos mande a sua dúvida</h2>
              <textarea
                placeholder="digite aqui a sua duvida"
                value={novaDuvida}
                onChange={e => setNovaDuvida(e.target.value)}
                disabled={loading}
                style={{
                  width: '100%',
                  minHeight: 80,
                  borderRadius: 8,
                  border: '1px solid #ccc',
                  padding: 12,
                  fontSize: 16,
                  resize: 'vertical',
                  background: '#fafafa',
                  color: '#222',
                  opacity: loading ? 0.6 : 0.9
                }}
              />
              <button
                onClick={handleEnviar}
                disabled={loading || novaDuvida.trim() === ""}
                style={{
                  marginTop: 12,
                  padding: '10px 24px',
                  borderRadius: 6,
                  border: 'none',
                  background: (loading || novaDuvida.trim() === "") ? '#a0c4ff' : '#0070f3',
                  color: '#fff',
                  fontSize: 16,
                  cursor: (loading || novaDuvida.trim() === "") ? 'not-allowed' : 'pointer',
                  fontWeight: 500,
                  transition: 'background 0.3s'
                }}
              >
                {loading ? "Enviando..." : "Enviar"}
              </button>
            </div>
            {/* Botão para acompanhar dúvidas */}
            <div style={{ width: '100%', margin: '32px 0 0 0' }}>
              <button
                onClick={handleAcompanhar}
                style={{
                  width: '100%',
                  padding: '12px 0',
                  borderRadius: 6,
                  border: '1px solid #0070f3',
                  background: '#f5faff',
                  color: '#0070f3',
                  fontSize: 16,
                  cursor: 'pointer',
                  fontWeight: 500,
                  marginBottom: 12
                }}
              >
                Acompanhe suas dúvidas
              </button>
            </div>
          </div>
          {/* Caixa flutuante de mensagem */}
          {showMensagem && (
            <div style={{
              position: 'fixed',
              top: 40,
              left: 0,
              right: 0,
              margin: '0 auto',
              width: 320,
              background: '#fff',
              border: '1px solid #0070f3',
              borderRadius: 8,
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              padding: '20px 32px 20px 20px',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ color: '#0070f3', fontSize: 16 }}>
                {mensagem}
              </span>
              <button
                onClick={handleCloseMensagem}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 18,
                  color: '#0070f3',
                  cursor: 'pointer',
                  marginLeft: 16,
                  fontWeight: 'bold',
                  lineHeight: 1
                }}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}