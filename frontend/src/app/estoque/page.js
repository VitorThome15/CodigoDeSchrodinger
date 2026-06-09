"use client";
import MenuBar from "../components/menubar/menubar";
import Navigation from "../components/navegation/navegation";
import styles from "./estoque.module.css";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:8080/api/items";
const CATEGORIES_URL = "http://localhost:8080/api/categories";
const SIZES_URL = "http://localhost:8080/api/sizes";

export default function EstoquePage() {
  const [itens, setItens] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  
  const [buscaNome, setBuscaNome] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [ordemNome, setOrdemNome] = useState("asc");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editId, setEditId] = useState(null);
  
  const [novoProduto, setNovoProduto] = useState({
    name: "", sex: "U", quantity: "", categoryId: "", sizeId: "",
  });
  
  const [editProduto, setEditProduto] = useState({
    name: "", sex: "U", quantity: "", categoryId: "", sizeId: "",
  });
  
  const hasNotification = false;

  const getFilteredSizes = (categoryId) => {
    if (!categoryId) return sizes;

    const categoriaSelecionada = categories.find(c => c.id === categoryId)?.name.toLowerCase() || "";
    const isInfantil = categoriaSelecionada.includes("infantil") || categoriaSelecionada.includes("infantis");

    if (!categoriaSelecionada.includes("roupa") && !categoriaSelecionada.includes("calçado") && !categoriaSelecionada.includes("calcado")) {
      return sizes.filter(s => s.name === "Tamanho Único" || s.name === "Único");
    }

    if ((categoriaSelecionada.includes("calçado") || categoriaSelecionada.includes("calcado")) && isInfantil) {
      return sizes.filter(s => /^\d+$/.test(s.name.trim()) && parseInt(s.name.trim()) <= 32);
    }

    if ((categoriaSelecionada.includes("calçado") || categoriaSelecionada.includes("calcado")) && !isInfantil) {
      return sizes.filter(s => /^\d+$/.test(s.name.trim()) && parseInt(s.name.trim()) >= 33);
    }

    if (categoriaSelecionada.includes("roupa") && isInfantil) {
      return sizes.filter(s => {
        const nome = s.name.toUpperCase().trim();
        if (nome === "RN" || nome === "TAMANHO ÚNICO") return true;
        if (/^\d+$/.test(nome) && parseInt(nome) <= 16) return true;
        return false;
      });
    }

    if (categoriaSelecionada.includes("roupa") && !isInfantil) {
      return sizes.filter(s => {
        const nome = s.name.trim();
        if (nome === "Tamanho Único") return true;
        return !/^\d+$/.test(nome);
      });
    }

    return []; 
  };

  useEffect(() => {
    fetch(API_URL).then((res) => res.json()).then((data) => setItens(Array.isArray(data) ? data : [])).catch(console.error);
    fetch(CATEGORIES_URL).then((res) => res.json()).then((data) => setCategories(Array.isArray(data) ? data : [])).catch(console.error);
    fetch(SIZES_URL).then((res) => res.json()).then((data) => setSizes(Array.isArray(data) ? data : [])).catch(console.error);
  }, []);

  async function handleAddProduto(e) {
    e.preventDefault();
    
    const isAlimento = categories.find(c => c.id === novoProduto.categoryId)?.name.toLowerCase().includes("alimento");
    let sizeFinal = novoProduto.sizeId;
    let sexFinal = novoProduto.sex;
    
    if (isAlimento) {
      sizeFinal = sizes.find(s => s.name === "Tamanho Único" || s.name === "Único")?.id || "";
      sexFinal = "U";
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: novoProduto.name,
          sex: sexFinal,
          quantity: Number(novoProduto.quantity),
          categoryId: novoProduto.categoryId,
          sizeId: sizeFinal,
        }),
      });
      if (!res.ok) throw new Error("Erro ao adicionar");
      const novo = await res.json();
      setItens((prev) => [...prev, novo]);
      setNovoProduto({ name: "", sex: "U", quantity: "", categoryId: "", sizeId: "" });
      setShowAddModal(false);
    } catch (err) {
      alert("Erro ao adicionar produto.");
    }
  }

  function openDeleteModal(item) {
    setItemToDelete(item);
    setShowDeleteModal(true);
  }

  async function handleDeleteProduto() {
    try {
      await fetch(`${API_URL}/${itemToDelete.id}`, { method: "DELETE" });
      setItens((prev) => prev.filter((item) => item.id !== itemToDelete.id));
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
    }
  }

  function startEditProduto(item) {
    setEditId(item.id);
    setEditProduto({
      name: item.name || "",
      sex: item.sex?.toUpperCase() || "U",
      quantity: item.quantity || "",
      categoryId: item.category?.id || "",
      sizeId: item.size?.id || "",
    });
    setShowEditModal(true);
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditProduto((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  }

  async function saveEditProduto(e) {
    e.preventDefault();
    
    const isAlimento = categories.find(c => c.id === editProduto.categoryId)?.name.toLowerCase().includes("alimento");
    let sizeFinal = editProduto.sizeId;
    let sexFinal = editProduto.sex;
    
    if (isAlimento) {
      sizeFinal = sizes.find(s => s.name === "Tamanho Único" || s.name === "Único")?.id || "";
      sexFinal = "U";
    }

    try {
      const res = await fetch(`${API_URL}/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editProduto,
          sex: sexFinal,
          sizeId: sizeFinal,
        }),
      });
      if (!res.ok) throw new Error("Erro ao editar");
      const updated = await res.json();
      setItens((prev) => prev.map((item) => (item.id === editId ? updated : item)));
      setShowEditModal(false);
      setEditId(null);
    } catch (err) {
      console.error("Erro ao editar produto:", err);
    }
  }

  const isAlimentoAdd = categories.find(c => c.id === novoProduto.categoryId)?.name.toLowerCase().includes("alimento");
  const isAlimentoEdit = categories.find(c => c.id === editProduto.categoryId)?.name.toLowerCase().includes("alimento");

  const itensFiltrados = itens
    .filter(item => {
      const matchCategoria = filtroCategoria === "" || item.category?.id === filtroCategoria;
      const matchNome = item.name.toLowerCase().includes(buscaNome.toLowerCase());
      return matchCategoria && matchNome;
    })
    .sort((a, b) => {
      if (ordemNome === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

  return (
    <div className={styles.containerGeral}>
      <Navigation />
      <MenuBar hasNotification={hasNotification} />
      
      <main className={styles.contentWrapper}>
        <div className={styles.listContainer}>
          <h1 className={styles.titulo}>Controle de Estoque</h1>
          <div className={styles.decoracao}></div>
          
          <div className={styles.actionsHeader} style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            {/* O botão fica fixo no lado esquerdo */}
            <button className={`${styles.btn} ${styles.btnAdicionar}`} onClick={() => setShowAddModal(true)}>
              + Adicionar Produto
            </button>
            
            {/* Os filtros ficam alinhados no lado direito */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <input 
                type="text" 
                className={styles.formInput} 
                placeholder="Buscar produto por nome..." 
                value={buscaNome}
                onChange={(e) => setBuscaNome(e.target.value)}
                style={{ width: '220px', padding: '8px 12px', fontSize: '0.95rem' }}
              />

              <select 
                className={styles.formInput} 
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                style={{ width: '200px', padding: '8px 12px', fontSize: '0.95rem' }}
              >
                <option value="">Todas as Categorias</option>
                {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>

              <button 
                className={`${styles.btn} ${styles.btnEditar}`} 
                onClick={() => setOrdemNome(ordemNome === "asc" ? "desc" : "asc")}
                style={{ margin: 0, padding: '8px 16px', fontSize: '0.95rem', minWidth: '130px' }}
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
                  <th>Categoria</th>
                  <th>Tamanho</th>
                  <th>Sexo</th>
                  <th>Quantidade</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {itensFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: "32px", textAlign: "center", color: "#666" }}>
                      Nenhum produto encontrado com estes filtros.
                    </td>
                  </tr>
                ) : (
                  itensFiltrados.map((item) => {
                    const isAlimentoRow = item.category?.name?.toLowerCase().includes("alimento");

                    return (
                      <tr key={item.id}>
                        <td style={{ textTransform: "capitalize" }}>{item.name}</td>
                        <td>{item.category?.name || "-"}</td>
                        <td>{isAlimentoRow ? "-" : (item.size?.name || "-")}</td>
                        <td>
                          {isAlimentoRow 
                            ? "-" 
                            : item.sex?.toUpperCase() === "M" 
                              ? "Masculino" 
                              : item.sex?.toUpperCase() === "F" 
                                ? "Feminino" 
                                : "Unissex"}
                        </td>
                        <td>{item.quantity}</td>
                        <td>
                          <button className={`${styles.btn} ${styles.btnEditar}`} onClick={() => startEditProduto(item)}>Editar</button>
                          <button className={`${styles.btn} ${styles.btnExcluir}`} onClick={() => openDeleteModal(item)}>Excluir</button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Adicionar */}
        {showAddModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2 className={styles.titulo} style={{ fontSize: "1.5rem" }}>Adicionar Produto</h2>
              <form className={styles.formulario} onSubmit={handleAddProduto}>
                
                <label className={styles.formLabel}>
                  Categoria
                  <select 
                    className={styles.formInput} 
                    required 
                    value={novoProduto.categoryId} 
                    onChange={(e) => {
                      e.target.setCustomValidity('');
                      setNovoProduto({ ...novoProduto, categoryId: e.target.value, sizeId: "" });
                    }}
                    onInvalid={(e) => e.target.setCustomValidity('Por favor, selecione uma categoria.')}
                  >
                    <option value="">Selecione a categoria</option>
                    {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                  </select>
                </label>

                <label className={styles.formLabel}>
                  Nome
                  <input 
                    className={styles.formInput} 
                    style={{ textTransform: "capitalize" }}
                    required 
                    value={novoProduto.name} 
                    onChange={(e) => {
                      e.target.setCustomValidity('');
                      setNovoProduto({ ...novoProduto, name: e.target.value });
                    }} 
                    onInvalid={(e) => e.target.setCustomValidity('Por favor, preencha o nome do produto.')}
                    placeholder={isAlimentoAdd ? "Ex: Arroz 1kg, Lentilha 500g" : "Ex: Tênis Nike, Camiseta Básica"} 
                  />
                </label>
                
                {!isAlimentoAdd && (
                  <label className={styles.formLabel}>
                    Tamanho
                    <select 
                      className={styles.formInput} 
                      required={!isAlimentoAdd} 
                      disabled={!novoProduto.categoryId}
                      value={novoProduto.sizeId} 
                      onChange={(e) => {
                        e.target.setCustomValidity('');
                        setNovoProduto({ ...novoProduto, sizeId: e.target.value });
                      }}
                      onInvalid={(e) => e.target.setCustomValidity('Por favor, selecione um tamanho.')}
                    >
                      {!novoProduto.categoryId ? (
                        <option value="">Selecione a categoria antes</option>
                      ) : (
                        <>
                          <option value="">Selecione o tamanho</option>
                          {getFilteredSizes(novoProduto.categoryId).map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                        </>
                      )}
                    </select>
                  </label>
                )}

                {!isAlimentoAdd && (
                  <label className={styles.formLabel}>
                    Sexo
                    <select className={styles.formInput} value={novoProduto.sex} onChange={(e) => setNovoProduto({ ...novoProduto, sex: e.target.value })}>
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                      <option value="U">Unissex</option>
                    </select>
                  </label>
                )}
                
                <label className={styles.formLabel}>
                  Quantidade
                  <input 
                    className={styles.formInput} 
                    required 
                    type="number" 
                    min={1} 
                    value={novoProduto.quantity} 
                    onChange={(e) => {
                      e.target.setCustomValidity('');
                      setNovoProduto({ ...novoProduto, quantity: e.target.value });
                    }} 
                    onInvalid={(e) => e.target.setCustomValidity('Por favor, insira a quantidade.')}
                  />
                </label>
                
                <div className={styles.modalBotoes}>
                  <button type="button" className={`${styles.btn} ${styles.btnExcluir}`} onClick={() => setShowAddModal(false)}>Cancelar</button>
                  <button type="submit" className={`${styles.btn} ${styles.btnAdicionar}`}>Adicionar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Editar */}
        {showEditModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2 className={styles.titulo} style={{ fontSize: "1.5rem" }}>Editar Produto</h2>
              <form className={styles.formulario} onSubmit={saveEditProduto}>
                
                <label className={styles.formLabel}>
                  Categoria
                  <select 
                    className={styles.formInput} 
                    required 
                    name="categoryId" 
                    value={editProduto.categoryId} 
                    onChange={(e) => {
                      e.target.setCustomValidity('');
                      handleEditChange(e);
                    }}
                    onInvalid={(e) => e.target.setCustomValidity('Por favor, selecione uma categoria.')}
                  >
                    <option value="">Selecione a categoria</option>
                    {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                  </select>
                </label>

                <label className={styles.formLabel}>
                  Nome
                  <input 
                    className={styles.formInput} 
                    style={{ textTransform: "capitalize" }}
                    required 
                    name="name" 
                    value={editProduto.name} 
                    onChange={(e) => {
                      e.target.setCustomValidity('');
                      handleEditChange(e);
                    }} 
                    onInvalid={(e) => e.target.setCustomValidity('Por favor, preencha o nome do produto.')}
                    placeholder={isAlimentoEdit ? "Ex: Arroz 1kg, Lentilha 500g" : "Ex: Tênis Nike, Camiseta Básica"} 
                  />
                </label>
                
                {!isAlimentoEdit && (
                  <label className={styles.formLabel}>
                    Tamanho
                    <select 
                      className={styles.formInput} 
                      required={!isAlimentoEdit} 
                      disabled={!editProduto.categoryId}
                      name="sizeId" 
                      value={editProduto.sizeId} 
                      onChange={(e) => {
                        e.target.setCustomValidity('');
                        handleEditChange(e);
                      }}
                      onInvalid={(e) => e.target.setCustomValidity('Por favor, selecione um tamanho.')}
                    >
                      {!editProduto.categoryId ? (
                        <option value="">Selecione a categoria antes</option>
                      ) : (
                        <>
                          <option value="">Selecione o tamanho</option>
                          {getFilteredSizes(editProduto.categoryId).map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                        </>
                      )}
                    </select>
                  </label>
                )}

                {!isAlimentoEdit && (
                  <label className={styles.formLabel}>
                    Sexo
                    <select className={styles.formInput} name="sex" value={editProduto.sex} onChange={handleEditChange}>
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                      <option value="U">Unissex</option>
                    </select>
                  </label>
                )}
                
                <label className={styles.formLabel}>
                  Quantidade
                  <input 
                    className={styles.formInput} 
                    required 
                    type="number" 
                    min={1} 
                    name="quantity" 
                    value={editProduto.quantity} 
                    onChange={(e) => {
                      e.target.setCustomValidity('');
                      handleEditChange(e);
                    }} 
                    onInvalid={(e) => e.target.setCustomValidity('Por favor, insira a quantidade.')}
                  />
                </label>
                
                <div className={styles.modalBotoes}>
                  <button type="button" className={`${styles.btn} ${styles.btnExcluir}`} onClick={() => setShowEditModal(false)}>Cancelar</button>
                  <button type="submit" className={`${styles.btn} ${styles.btnAdicionar}`}>Salvar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Excluir */}
        {showDeleteModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2 className={styles.titulo} style={{ fontSize: "1.5rem" }}>Confirmar Exclusão</h2>
              <p style={{ textAlign: "center", marginTop: "16px" }}>
                Tem certeza que deseja excluir o produto <b style={{ textTransform: "capitalize" }}>{itemToDelete?.name}</b>?
              </p>
              
              {/* Ordem dos botões invertida: SIM na esquerda, NÃO na direita */}
              <div className={styles.modalBotoes} style={{ justifyContent: "center" }}>
                <button className={`${styles.btn} ${styles.btnAdicionar}`} onClick={handleDeleteProduto}>Sim</button>
                <button className={`${styles.btn} ${styles.btnExcluir}`} onClick={() => setShowDeleteModal(false)}>Não</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}