"use client";
import React, { useEffect, useState } from "react";
import MenuBar from "../../components/menubar/menubar";
import Navigation from "../../components/navegation/navegation";
import styles from "./lista.module.css";
import { useRouter } from "next/navigation";
import modalStyles from "./lista.module.css";

const API_URL = "http://localhost:8080/api/givers";
const BASE_URL = "http://localhost:8080/api";

export default function ListaDoadores() {
  const [doadores, setDoadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [buscaNome, setBuscaNome] = useState("");
  const [ordemNome, setOrdemNome] = useState("asc");
  
  const router = useRouter();
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar dados do servidor.");
        return res.json();
      })
      .then((data) => setDoadores(Array.isArray(data) ? data : []))
      .catch((err) => setError("Erro ao carregar doadores"))
      .finally(() => setLoading(false));
  }, []);

  const doadoresProcessados = doadores
    .filter((d) => d.person?.name?.toLowerCase().includes(buscaNome.toLowerCase()))
    .sort((a, b) => {
      const nomeA = a.person?.name || "";
      const nomeB = b.person?.name || "";
      return ordemNome === "asc" ? nomeA.localeCompare(nomeB) : nomeB.localeCompare(nomeA);
    });

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este doador?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar.");
      setDoadores(doadores.filter((d) => d.id !== id));
      alert("Doador removido com sucesso!");
    } catch (err) { setError("Erro ao remover doador"); } finally { setLoading(false); }
  };

  const openEditModal = (doador) => {
    console.log("Dados do doador selecionado:", doador);
    
    setEditForm({
      id: doador.id ?? "", 
      personId: doador.person?.id ?? "", 
      addressId: doador.person?.address?.id ?? "",
      nomeCompleto: doador.person?.name ?? "", 
      email: doador.person?.email ?? "",
      telefoneCelular: doador.person?.phone ?? "", 
      cpf: doador.person?.cpf ?? "",
      endereco: doador.person?.address?.street ?? "", 
      numero: doador.person?.address?.number ?? "",
      complemento: doador.person?.address?.complement ?? "", 
      bairro: doador.person?.address?.neighborhood ?? "",
      pontoReferencia: doador.person?.address?.referencePoint ?? "",
    });
    setEditError("");
    setEditModalOpen(true);
  };

  const closeEditModal = () => { 
    setEditModalOpen(false); 
    setEditForm(null); 
    setEditError(""); 
  };
  
  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    
    const cpfLimpo = (editForm.cpf || "").replace(/\D/g, "");
    
    try {
      // 1. ENVIO DO ENDEREÇO + VALIDAÇÃO DE SUCESSO
      if (editForm.addressId) {
        const resAddress = await fetch(`${BASE_URL}/addresses/${editForm.addressId}`, {
          method: "PUT", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            street: editForm.endereco, 
            neighborhood: editForm.bairro, 
            number: Number(editForm.numero), 
            complement: editForm.complemento, 
            referencePoint: editForm.pontoReferencia 
          })
        });
        
        if (!resAddress.ok) {
          const txtErro = await resAddress.text();
          throw new Error(`O servidor recusou a atualização do Endereço (Status ${resAddress.status}): ${txtErro}`);
        }
      }
      
      // 2. ENVIO DOS DADOS PESSOAIS + VALIDAÇÃO DE SUCESSO
      if (editForm.personId) {
        const resPerson = await fetch(`${BASE_URL}/people/${editForm.personId}`, {
          method: "PUT", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            name: editForm.nomeCompleto, 
            phone: editForm.telefoneCelular, 
            email: editForm.email, 
            cpf: cpfLimpo, 
            idAddress: editForm.addressId 
          })
        });
        
        if (!resPerson.ok) {
          const txtErro = await resPerson.text();
          throw new Error(`O servidor recusou os dados da Pessoa (Status ${resPerson.status}): ${txtErro}`);
        }
      }
      
      // 3. SE AMBOS SALVARAM NO BANCO, ATUALIZA A TABELA LOCAL PRESERVANDO A ESTRUTURA
      setDoadores(doadores.map(d => 
        d.id === editForm.id 
          ? { 
              ...d, 
              person: { 
                ...d.person, 
                name: editForm.nomeCompleto, 
                email: editForm.email, 
                phone: editForm.telefoneCelular, 
                cpf: cpfLimpo, 
                address: { 
                  ...d.person?.address, 
                  street: editForm.endereco, 
                  neighborhood: editForm.bairro,
                  number: Number(editForm.numero),
                  complement: editForm.complemento,
                  referencePoint: editForm.pontoReferencia
                } 
              } 
            } 
          : d
      ));
      
      closeEditModal();
      alert("Doador atualizado com sucesso!");
    } catch (err) { 
      console.error("Erro detalhado no salvamento:", err);
      setEditError(err.message); 
      alert("Falha ao salvar alterações:\n" + err.message);
    } finally { 
      setEditLoading(false); 
    }
  };

  return (
    <div className={styles.containerGeral}>
      <MenuBar /><Navigation />
      <div className={styles.contentWrapper}>
        <div className={styles.listContainer}>
          <h1 className={styles.titulo}>Doadores Cadastrados</h1>
          <div className={styles.decoracao}></div>
          
          <div className={styles.actionsHeader}>
            <button className={styles.addButton} onClick={() => router.push("/cadastrodoador")}>+ Adicionar Doador</button>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input type="text" className={styles.formInput} placeholder="Buscar..." value={buscaNome} onChange={(e) => setBuscaNome(e.target.value)} style={{ width: '250px', padding: '10px' }} />
              
              <button 
                onClick={() => setOrdemNome(ordemNome === "asc" ? "desc" : "asc")} 
                style={{ 
                  padding: '10px 16px', 
                  borderRadius: '8px', 
                  border: 'none', 
                  background: 'var(--color-primary, #1976d2)', 
                  color: '#fff', 
                  cursor: 'pointer', 
                  fontWeight: '600',
                  whiteSpace: 'nowrap'
                }}
              >
                Ordem: {ordemNome === "asc" ? "A - Z ↓" : "Z - A ↑"}
              </button>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.beneficiariosTable}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>CPF</th>
                  <th>Bairro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr key="loading-row"><td colSpan={6} className={styles.loadingMessage}>Carregando...</td></tr>
                ) : error ? (
                  <tr key="error-row"><td colSpan={6} className={styles.errorMessage}>{error}</td></tr>
                ) : doadoresProcessados.length === 0 ? (
                  <tr key="empty-row"><td colSpan={6} className={styles.noDataMessage}>Nenhum doador encontrado.</td></tr>
                ) : (
                  doadoresProcessados.map((d) => (
                    <tr key={d.id}>
                      <td style={{ textTransform: "capitalize" }}>{d.person?.name}</td>
                      <td>{d.person?.email}</td>
                      <td>{d.person?.phone}</td>
                      <td>{d.person?.cpf || "–"}</td>
                      <td style={{ textTransform: "capitalize" }}>{d.person?.address?.neighborhood || "–"}</td>
                      <td className={styles.actionButtons}>
                        <button className={styles.editButton} onClick={() => openEditModal(d)}>Editar</button>
                        <button className={styles.deleteButton} onClick={() => handleDelete(d.id)}>Excluir</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editModalOpen && (
        <div className={modalStyles.modalOverlay}>
          <div className={modalStyles.modalContent}>
            <h2 className={modalStyles.titulo}>Editar Doador</h2>
            <form onSubmit={handleEditSubmit} className={modalStyles.formulario}>
              <div className={modalStyles.formGroup}>
                <label htmlFor="edit_nomeCompleto"><b>Nome completo*</b></label>
                <input id="edit_nomeCompleto" name="nomeCompleto" value={editForm.nomeCompleto} onChange={handleEditChange} required />
              </div>
              <div className={modalStyles.formGroup}>
                <label htmlFor="edit_email"><b>E-mail*</b></label>
                <input id="edit_email" name="email" type="email" value={editForm.email} onChange={handleEditChange} required />
              </div>
              <div className={modalStyles.formGroup}>
                <label htmlFor="edit_telefoneCelular"><b>Telefone*</b></label>
                <input id="edit_telefoneCelular" name="telefoneCelular" value={editForm.telefoneCelular} onChange={handleEditChange} required type="tel" />
              </div>
              <div className={modalStyles.formGroup}>
                <label htmlFor="edit_cpf"><b>CPF*</b></label>
                <input id="edit_cpf" name="cpf" value={editForm.cpf} onChange={handleEditChange} required />
              </div>
              <div className={modalStyles.formGroupFullWidth}>
                <label htmlFor="edit_endereco"><b>Endereço*</b></label>
                <input id="edit_endereco" name="endereco" value={editForm.endereco} onChange={handleEditChange} required />
              </div>
              <div className={modalStyles.formGroup}>
                <label htmlFor="edit_numero"><b>Número*</b></label>
                <input id="edit_numero" name="numero" type="number" value={editForm.numero} onChange={handleEditChange} required />
              </div>
              <div className={modalStyles.formGroup}>
                <label htmlFor="edit_complemento"><b>Complemento</b></label>
                <input id="edit_complemento" name="complemento" value={editForm.complemento} onChange={handleEditChange} />
              </div>
              <div className={modalStyles.formGroupFullWidth}>
                <label htmlFor="edit_bairro"><b>Bairro*</b></label>
                <input id="edit_bairro" name="bairro" value={editForm.bairro} onChange={handleEditChange} required />
              </div>
              <div className={modalStyles.formGroupFullWidth}>
                <label htmlFor="edit_pontoReferencia"><b>Ponto de referência</b></label>
                <input id="edit_pontoReferencia" name="pontoReferencia" value={editForm.pontoReferencia} onChange={handleEditChange} />
              </div>
              <div className={modalStyles.modalButtonGroup} style={{ justifyContent: 'center', gridColumn: '1 / -1' }}>
                <button type="button" onClick={closeEditModal} style={{ background: '#aaa', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" disabled={editLoading} style={{ background: '#18132b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}>
                  {editLoading ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
              {editError && <div className={modalStyles.errorMessage} style={{ gridColumn: "1 / -1", marginTop: "10px" }}>{editError}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}