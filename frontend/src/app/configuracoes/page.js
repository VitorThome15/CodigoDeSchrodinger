"use client";

import { useState, useEffect } from "react";
import Navigation from "../components/navegation/navegation";
import MenuBar from "../components/menubar/menubar";

const API_URL = "http://localhost:8080/api/people";

export default function ConfiguracoesPage() {
  const [userId, setUserId] = useState(null);
  const [nome, setNome] = useState("Seu Nome Atual");
  const [descricao, setDescricao] = useState("Sua descrição atual");
  const [email, setEmail] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  useEffect(() => {
    // Obter dados do usuário logado (você pode ajustar isso conforme necessário)
    const getUserData = async () => {
      try {
        // Exemplo: obter do localStorage ou de uma API
        const userIdStored = localStorage.getItem("userId");
        const emailStored = localStorage.getItem("userEmail");
        
        console.log("userId armazenado:", userIdStored);
        console.log("Email armazenado:", emailStored);
        
        if (userIdStored) {
          setUserId(userIdStored);
        }
        if (emailStored) {
          setEmail(emailStored);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    };
    getUserData();
  }, []);

  function handleSaveProfile() {
    console.log("Salvar nome + descrição", { nome, descricao });
    // Chamar API
  }

  async function handleSaveEmail() {
    if (!email) {
      setMensagem("Por favor, preencha o campo de email");
      setTipoMensagem("error");
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setMensagem("Por favor, insira um email válido");
      setTipoMensagem("error");
      return;
    }

    if (!userId) {
      setMensagem("Erro: ID do usuário não encontrado. Por favor, faça login novamente.");
      setTipoMensagem("error");
      console.log("userId não encontrado no localStorage");
      return;
    }

    try {
      setMensagem("Atualizando email...");
      setTipoMensagem("info");

      const url = `${API_URL}/${userId}`;
      console.log("Fazendo requisição para:", url);
      console.log("Dados:", { email });

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      console.log("Status da resposta:", response.status);

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userEmail", email);
        setMensagem("Email cadastrado com sucesso!");
        setTipoMensagem("success");
        console.log("Email atualizado:", data);
      } else {
        let errorMessage = "Erro ao atualizar email. Tente novamente.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Erro ${response.status}: ${response.statusText}`;
        }
        setMensagem(errorMessage);
        setTipoMensagem("error");
        console.error("Erro na resposta:", errorMessage);
      }
    } catch (error) {
      console.error("Erro ao atualizar email:", error);
      console.error("Stack:", error.stack);
      
      let mensagemErro = "Erro ao conectar com o servidor";
      if (error.message.includes("fetch")) {
        mensagemErro = "Não conseguiu conectar ao servidor. Verifique se o backend está rodando em " + API_URL;
      }
      
      setMensagem(mensagemErro);
      setTipoMensagem("error");
    }
  }

  function handleChangePassword() {
    if (novaSenha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }
    console.log("Alterar senha", { senhaAtual, novaSenha });
    // Chamar API
  }

  function handleDeleteAccount() {
    if (confirm("Tem certeza que deseja excluir sua conta? Esta ação é irreversível!")) {
      console.log("Conta excluída");
      // Chamar API de exclusão
    }
  }

  return (
    <>
      <Navigation />

      <div style={{ minHeight: "100vh", background: "#fff", marginLeft: 220 }}>
        <MenuBar />

        <main
          style={{
            maxWidth: 700,
            margin: "40px auto",
            display: "flex",
            flexDirection: "column",
            gap: 40,
            padding: "0 20px",
          }}
        >

          {/* ============================== */}
          {/*   SEÇÃO: EDITAR PERFIL         */}
          {/* ============================== */}
          <section
            style={{
              padding: 20,
              border: "1px solid #ddd",
              borderRadius: 8,
              background: "#fafafa",
            }}
          >
            <h2 style={{ marginBottom: 20 }}>Editar Perfil</h2>

            <label style={{ fontWeight: "bold" }}>Nome:</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                marginBottom: 20,
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />

            <label style={{ fontWeight: "bold" }}>Descrição:</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              style={{
                width: "100%",
                padding: 10,
                marginBottom: 20,
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />

            <button
              onClick={handleSaveProfile}
              style={{
                padding: "10px 20px",
                background: "#1a73e8",
                color: "#fff",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              Salvar Alterações
            </button>
          </section>

          {/* ============================== */}
          {/*   SEÇÃO: CADASTRAR EMAIL       */}
          {/* ============================== */}
          <section
            style={{
              padding: 20,
              border: "1px solid #ddd",
              borderRadius: 8,
              background: "#fafafa",
            }}
          >
            <h2 style={{ marginBottom: 20 }}>Cadastrar Email</h2>
            <p style={{ marginBottom: 20, color: "#666", fontSize: "14px" }}>
              Seu email será utilizado para recuperar sua senha e receber notificações importantes.
            </p>

            {mensagem && (
              <div
                style={{
                  padding: 12,
                  marginBottom: 20,
                  borderRadius: 6,
                  background:
                    tipoMensagem === "success"
                      ? "#d4edda"
                      : tipoMensagem === "error"
                      ? "#f8d7da"
                      : "#d1ecf1",
                  color:
                    tipoMensagem === "success"
                      ? "#155724"
                      : tipoMensagem === "error"
                      ? "#721c24"
                      : "#0c5460",
                  border:
                    tipoMensagem === "success"
                      ? "1px solid #c3e6cb"
                      : tipoMensagem === "error"
                      ? "1px solid #f5c6cb"
                      : "1px solid #bee5eb",
                }}
              >
                {mensagem}
              </div>
            )}

            <label style={{ fontWeight: "bold" }}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              style={{
                width: "100%",
                padding: 10,
                marginBottom: 20,
                borderRadius: 6,
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />

            <button
              onClick={handleSaveEmail}
              style={{
                padding: "10px 20px",
                background: "#1a73e8",
                color: "#fff",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              Cadastrar Email
            </button>
          </section>

          {/* ============================== */}
          <section
            style={{
              padding: 20,
              border: "1px solid #ddd",
              borderRadius: 8,
              background: "#fafafa",
            }}
          >
            <h2 style={{ marginBottom: 20 }}>Alterar Senha</h2>

            <label style={{ fontWeight: "bold" }}>Senha Atual:</label>
            <input
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                marginBottom: 20,
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />

            <label style={{ fontWeight: "bold" }}>Nova Senha:</label>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                marginBottom: 20,
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />

            <label style={{ fontWeight: "bold" }}>Confirmar Nova Senha:</label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 6,
                border: "1px solid #ccc",
                marginBottom: 20,
              }}
            />

            <button
              onClick={handleChangePassword}
              style={{
                padding: "10px 20px",
                background: "#1a73e8",
                color: "#fff",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              Atualizar Senha
            </button>
          </section>

          {/* ============================== */}
          {/*   SEÇÃO: EXCLUIR CONTA         */}
          {/* ============================== */}
          <section
            style={{
              padding: 20,
              border: "1px solid #f5b5b5",
              borderRadius: 8,
              background: "#ffecec",
            }}
          >
            <h2 style={{ color: "#d93025" }}>Excluir Conta</h2>
            <p style={{ marginBottom: 20 }}>
              Esta ação é permanente e não poderá ser desfeita.
            </p>

            <button
              onClick={handleDeleteAccount}
              style={{
                padding: "10px 20px",
                background: "#d93025",
                color: "#fff",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              Excluir Conta
            </button>
          </section>
        </main>
      </div>
    </>
  );
}