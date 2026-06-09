"use client";
import React, { useEffect, useState } from "react";
import MenuBar from "../../components/menubar/menubar";
import Navigation from "../../components/navegation/navegation";
import styles from "./lista.module.css";
import { useRouter } from "next/navigation";
import modalStyles from "./lista.module.css";

const API_URL = "http://localhost:8080/api/receivers";
const BASE_URL = "http://localhost:8080/api";

export default function ListaBeneficiarios() {
  const [beneficiarios, setBeneficiarios] = useState([]);
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
      .then((data) => setBeneficiarios(Array.isArray(data) ? data : []))
      .catch((err) => setError("Erro ao carregar beneficiários"))
      .finally(() => setLoading(false));
  }, []);

  const beneficiariosProcessados = beneficiarios
    .filter((b) => b.person?.name?.toLowerCase().includes(buscaNome.toLowerCase()))
    .sort((a, b) => {
      const nomeA = a.person?.name || "";
      const nomeB = b.person?.name || "";
      return ordemNome === "asc" ? nomeA.localeCompare(nomeB) : nomeB.localeCompare(nomeA);
    });

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este beneficiário?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar.");
      setBeneficiarios(beneficiarios.filter((b) => b.id !== id));
      alert("Beneficiário removido com sucesso!");
    } catch (err) { setError("Erro ao remover beneficiário"); } finally { setLoading(false); }
  };

  const openEditModal = (beneficiario) => {
    setEditForm({
      id: beneficiario.id ?? "", 
      personId: beneficiario.person?.id ?? "", 
      addressId: beneficiario.person?.address?.id ?? "",
      nomeCompleto: beneficiario.person?.name ?? "", 
      email: beneficiario.person?.email ?? "",
      telefoneCelular: beneficiario.person?.phone ?? "", 
      cpf: beneficiario.person?.cpf ?? "",
      endereco: beneficiario.person?.address?.street ?? "", 
      numero: beneficiario.person?.address?.number ?? "",
      complemento: beneficiario.person?.address?.complement ?? "", 
      bairro: beneficiario.person?.address?.neighborhood ?? "",
      pontoReferencia: beneficiario.person?.address?.referencePoint ?? "",
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
      
      setBeneficiarios(beneficiarios.map(b => 
        b.id === editForm.id 
          ? { 
              ...b, 
              person: { 
                ...b.person, 
                name: editForm.nomeCompleto, 
                email: editForm.email, 
                phone: editForm.telefoneCelular, 
                cpf: cpfLimpo, 
                address: { 
                  ...b.person?.address, 
                  street: editForm.endereco, 
                  neighborhood: editForm.bairro,
                  number: Number(editForm.numero),
                  complement: editForm.complemento,
                  referencePoint: editForm.pontoReferencia
                } 
              } 
            } 
          : b
      ));
      
      closeEditModal();
      alert("Beneficiário atualizado com sucesso!");
    } catch (err) { 
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
          <h1 className={styles.titulo}>Beneficiários Cadastrados</h1>
          <div className={styles.decoracao}></div>
          
          <div className={styles.actionsHeader}>
            <button className={styles.addButton} onClick={() => router.push("/cadastrobeneficiario")}>+ Adicionar Beneficiário</button>
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
              
              {loading && (
                <tbody>
                  <tr><td colSpan={6} className={styles.loadingMessage}>Carregando...</td></tr>
                </tbody>
              )}

              {error && (
                <tbody>
                  <tr><td colSpan={6} className={styles.errorMessage}>{error}</td></tr>
                </tbody>
              )}

              {!loading && !error && beneficiariosProcessados.length === 0 && (
                <tbody>
                  <tr><td colSpan={6} className={styles.noDataMessage}>Nenhum beneficiário encontrado.</td></tr>
                </tbody>
              )}

              {!loading && !error && beneficiariosProcessados.length > 0 && (
                <tbody>
                  {beneficiariosProcessados.map((b, index) => (
                    <tr key={b.id || index}>
                      <td style={{ textTransform: "capitalize" }}>{b.person?.name}</td>
                      <td>{b.person?.email}</td>
                      <td>{b.person?.phone}</td>
                      <td>{b.person?.cpf || "–"}</td>
                      <td style={{ textTransform: "capitalize" }}>{b.person?.address?.neighborhood || "–"}</td>
                      <td className={styles.actionButtons}>
                        <button className={styles.editButton} onClick={() => openEditModal(b)}>Editar</button>
                        <button className={styles.deleteButton} onClick={() => handleDelete(b.id)}>Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>

      {editModalOpen && (
        <div className={modalStyles.modalOverlay}>
          <div className={modalStyles.modalContent}>
            <h2 className={modalStyles.titulo}>Editar Beneficiário</h2>
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
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center', width: '100%', gridColumn: '1 / -1', marginTop: '20px' }}>
              <button 
                type="button" 
                onClick={closeEditModal} 
                style={{ background: '#aaa', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', width: '100%', maxWidth: '200px', textAlign: 'center' }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={editLoading} 
                style={{ background: 'var(--color-primary, #18132b)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', width: '100%', maxWidth: '200px', textAlign: 'center' }}
              >
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