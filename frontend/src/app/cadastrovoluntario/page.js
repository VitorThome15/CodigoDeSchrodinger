"use client";
import React, { useState } from "react";
import MenuBar from "../components/menubar/menubar";
import Navegation from "../components/navegation/navegation";
import { useRouter } from "next/navigation";
import styles from "./cadastrovoluntario.module.css";

const BASE_URL = "http://localhost:8080/api";

const CadastroVoluntario = () => {
  const [form, setForm] = useState({
    nomeCompleto: "",
    telefoneCelular: "",
    email: "",
    cpf: "",
    senha: "",
    endereco: "",
    bairro: "",
    numero: "",
    complemento: "",
    pontoReferencia: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const cpfLimpo = form.cpf.replace(/\D/g, "");
    const telefoneLimpo = form.telefoneCelular.replace(/\D/g, "");

    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
      setError("Telefone deve conter entre 10 e 11 dígitos (incluindo DDD).");
      setLoading(false);
      return;
    }

    if (cpfLimpo.length !== 11) {
      setError("CPF deve conter 11 dígitos numéricos.");
      setLoading(false);
      return;
    }

    try {
      const addressRes = await fetch(`${BASE_URL}/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          street: form.endereco,
          neighborhood: form.bairro,
          number: Number(form.numero),
          complement: form.complemento || "N/A",
          referencePoint: form.pontoReferencia || "N/A",
        }),
      });
      if (!addressRes.ok) throw new Error("Erro ao cadastrar endereço.");
      const address = await addressRes.json();

      const personRes = await fetch(`${BASE_URL}/people`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.nomeCompleto,
          phone: form.telefoneCelular,
          email: form.email,
          cpf: cpfLimpo,
          idAddress: address.id,
        }),
      });
      if (!personRes.ok) throw new Error("Erro ao cadastrar pessoa.");
      const person = await personRes.json();

      const voluntaryRes = await fetch(`${BASE_URL}/voluntaries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personId: person.id,
          password: form.senha,
          isActive: true,
        }),
      });
      if (!voluntaryRes.ok) throw new Error("Erro ao cadastrar voluntário.");

      router.push("/sucesso?tipo=voluntarios");
    } catch (err) {
      setError(err.message || "Erro ao cadastrar voluntário.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.containerGeral}>
      <MenuBar />
      <Navegation />
      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <h1 className={styles.titulo}>Cadastro de Voluntário</h1>
          <div className={styles.decoracao}></div>
          <form onSubmit={handleSubmit} className={styles.formulario}>
            <div className={styles.formGroup}>
              <label htmlFor="nomeCompleto"><b>Nome completo*</b></label>
              <input id="nomeCompleto" name="nomeCompleto" value={form.nomeCompleto} onChange={handleChange} required placeholder="Fulano da Silva" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email"><b>E-mail*</b></label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="fulano@gmail.com" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="telefoneCelular"><b>Telefone*</b></label>
              <input id="telefoneCelular" name="telefoneCelular" value={form.telefoneCelular} onChange={handleChange} required placeholder="(45) 9 9988-7766" type="tel" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cpf"><b>CPF*</b></label>
              <input id="cpf" name="cpf" type="text" maxLength={11} value={form.cpf}
                onChange={e => setForm({ ...form, cpf: e.target.value.replace(/\D/g, "") })}
                placeholder="11122233355" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="senha"><b>Senha*</b></label>
              <input id="senha" name="senha" type="password" value={form.senha} onChange={handleChange} required placeholder="Mínimo 6 caracteres" minLength={6} />
            </div>
            <hr className={styles.separador} />
            <div className={styles.formGroupFullWidth}>
              <label htmlFor="endereco"><b>Endereço*</b></label>
              <input id="endereco" name="endereco" value={form.endereco} onChange={handleChange} required placeholder="Rua da Água" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="numero"><b>Número*</b></label>
              <input id="numero" name="numero" type="number" value={form.numero} onChange={handleChange} required placeholder="2015" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="complemento"><b>Complemento</b></label>
              <input id="complemento" name="complemento" value={form.complemento} onChange={handleChange} placeholder="Ap 307" />
            </div>
            <div className={styles.formGroupFullWidth}>
              <label htmlFor="bairro"><b>Bairro*</b></label>
              <input id="bairro" name="bairro" value={form.bairro} onChange={handleChange} required placeholder="Centro" />
            </div>
            <div className={styles.formGroupFullWidth}>
              <label htmlFor="pontoReferencia"><b>Ponto de referência</b></label>
              <input id="pontoReferencia" name="pontoReferencia" value={form.pontoReferencia} onChange={handleChange} placeholder="Em frente ao parque" />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar Voluntário"}
            </button>
            {error && <div className={styles.errorMessage}>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroVoluntario;