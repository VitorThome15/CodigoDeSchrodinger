"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";
import Link from "next/link";

// Usuário administrativo padrão
const ADMIN_USER = "adm";
const TEST_USER_EMAIL = "adm@gmail.com";

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const form = e.target;
    const usuario = form[0].value;
    const senha = form[1].value;
    
    // 🚨 --- INÍCIO DA TRAPAÇA (MODO DESENVOLVEDOR) --- 🚨
    if (usuario === ADMIN_USER && senha === "1234") {
      // Simulamos a resposta do backend e liberamos o acesso na hora!
      localStorage.setItem("userId", "id-teste-123");
      localStorage.setItem("username", ADMIN_USER);
      localStorage.setItem("userEmail", TEST_USER_EMAIL);
      localStorage.setItem("userPhone", "00000000000");
      
      alert("Acesso Liberado (Modo Desenvolvedor)!");
      window.location.href = "/home";
      return; // O 'return' impede que ele tente chamar o Java
    }
    // 🚨 --- FIM DA TRAPAÇA --- 🚨

    // Caso você tente logar com outro usuário, ele fará o fluxo normal:
    if (usuario !== ADMIN_USER) {
      setError("Usuário ou senha incorretos.");
      setLoading(false);
      return;
    }
    
    try {
      // Fazer login com email do usuário adm (Fluxo Real)
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: TEST_USER_EMAIL,
          password: senha
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Armazenar dados do usuário
        localStorage.setItem("userId", data.id);
        localStorage.setItem("username", ADMIN_USER);
        localStorage.setItem("userEmail", data.email || "");
        localStorage.setItem("userPhone", data.phone || "");
        
        alert("Login realizado com sucesso!");
        window.location.href = "/home";
      } else {
        setError(data.message || "Usuário ou senha incorretos");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setError("Erro ao conectar ao servidor. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className={styles.page}>
        <div className={styles.loginBox}>
          <div className={styles.logoContainer}>
            <Image src="/logo-sanem.svg" alt="Logo SANEM" width={120} height={120} className={styles.logo} />
          </div>
          <h2 className={styles.loginTitle}>Login</h2>
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <input type="text" placeholder="Usuário" className={styles.input} required disabled={loading} />
            <input type="password" placeholder="Senha" className={styles.input} required disabled={loading} />
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Conectando..." : "Login"}
            </button>
          </form>
          {error && <div className={styles.errorMsg}>{error}</div>}
          <Link href="/recuperar-senha" className={styles.forgot}>Esqueci minha senha</Link>
        </div>
      </div>
    </>
  );
}