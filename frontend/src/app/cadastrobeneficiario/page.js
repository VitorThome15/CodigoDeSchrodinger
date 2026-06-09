"use client";
import React, { useState } from "react";
import MenuBar from "../components/menubar/menubar";
import Navegation from "../components/navegation/navegation";
import { useRouter } from "next/navigation";
import styles from "./cadastrobeneficiario.module.css";

const BASE_URL = "http://localhost:8080/api";

const CadastroBeneficiario = () => {
  const [form, setForm] = useState({
    nomeCompleto: "",
    telefoneCelular: "",
    email: "",
    cpfCrnm: "",
    nif: "",
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

    const cpfLimpo = form.cpfCrnm.replace(/\D/g, "");
    const nifLimpo = form.nif.replace(/\D/g, "");

    if (cpfLimpo.length === 0 && nifLimpo.length === 0) {
      setError("É obrigatório preencher pelo menos um dos campos: CPF/CRNM ou NIF.");
      setLoading(false);
      return;
    }

    if (cpfLimpo.length > 0 && cpfLimpo.length !== 11) {
      setError("CPF/CRNM deve conter 11 dígitos numéricos.");
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
          cpf: cpfLimpo || nifLimpo, 
          idAddress: address.id,
        }),
      });
      if (!personRes.ok) throw new Error("Erro ao cadastrar pessoa.");
      const person = await personRes.json();

      const receiverRes = await fetch(`${BASE_URL}/receivers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personId: person.id,
          isFit: true,
          nif: nifLimpo || cpfLimpo, 
        }),
      });
      
      if (!receiverRes.ok) {
         const txtErro = await receiverRes.text();
         throw new Error(`Erro ao cadastrar beneficiário: ${txtErro}`);
      }

      router.push("/sucesso?tipo=beneficiarios");
    } catch (err) {
      setError(err.message || "Erro ao cadastrar beneficiário.");
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
          <h1 className={styles.titulo}>Cadastro de Beneficiário</h1>
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
              <label htmlFor="cpfCrnm"><b>CPF/CRNM (opcional se NIF for preenchido)</b></label>
              <input id="cpfCrnm" name="cpfCrnm" type="text" maxLength={11} value={form.cpfCrnm}
                onChange={e => setForm({ ...form, cpfCrnm: e.target.value.replace(/\D/g, "") })}
                placeholder="11122233355" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="nif"><b>NIF (opcional se CPF/CRNM for preenchido)</b></label>
              <input id="nif" name="nif" type="text" value={form.nif}
                onChange={e => setForm({ ...form, nif: e.target.value.replace(/\D/g, "") })}
                placeholder="123456789" />
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
            
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', width: '100%', marginTop: '20px' }}>
              <button 
                type="button" 
                onClick={() => router.push('/cadastrobeneficiario/lista')} 
                style={{ background: '#aaa', color: '#fff', border: 'none', padding: '14px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', width: '100%', maxWidth: '250px' }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={loading} 
                style={{ background: 'var(--color-primary, #18132b)', color: '#fff', border: 'none', padding: '14px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', width: '100%', maxWidth: '250px' }}
              >
                {loading ? "Cadastrando..." : "Cadastrar Beneficiário"}
              </button>
            </div>
            {error && <div className={styles.errorMessage} style={{ marginTop: '15px', textAlign: 'center' }}>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroBeneficiario;