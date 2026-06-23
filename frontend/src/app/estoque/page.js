"use client";
import MenuBar from "../components/menubar/menubar";
import Navigation from "../components/navegation/navegation";
import styles from "./estoque.module.css";
import { useState, useEffect } from "react";

const BASE_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
const API_URL = `${BASE_API}/items`;
const CATEGORIES_URL = `${BASE_API}/categories`;
const SIZES_URL = `${BASE_API}/sizes`;

export default function EstoquePage() {
  const [itens, setItens] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [novoProduto, setNovoProduto] = useState({
    name: "",
    sex: "U",
    quantity: "",
    categoryId: "",
    sizeId: "",
  });
  const [editId, setEditId] = useState(null);
  const [editProduto, setEditProduto] = useState({
    name: "",
    sex: "U",
    quantity: "",
    categoryId: "",
    sizeId: "",
  });
  const hasNotification = false;

  // Carrega itens, categorias e tamanhos do backend (com tratamento de erros)
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadAll() {
      try {
        const resItems = await fetch(API_URL);
        if (!resItems.ok) throw new Error(`Items fetch failed: ${resItems.status}`);
        const dataItems = await resItems.json();
        if (mounted) setItens(Array.isArray(dataItems) ? dataItems : []);

        const resCats = await fetch(CATEGORIES_URL);
        if (!resCats.ok) throw new Error(`Categories fetch failed: ${resCats.status}`);
        const dataCats = await resCats.json();
        if (mounted) setCategories(Array.isArray(dataCats) ? dataCats : []);

        const resSizes = await fetch(SIZES_URL);
        if (!resSizes.ok) throw new Error(`Sizes fetch failed: ${resSizes.status}`);
        const dataSizes = await resSizes.json();
        if (mounted) setSizes(Array.isArray(dataSizes) ? dataSizes : []);

        if (mounted) setFetchError(null);
      } catch (err) {
        console.error("Erro ao carregar dados do backend:", err);
        if (mounted) setFetchError(err.message || "Falha ao buscar dados");
      }
    }

    loadAll();
    return () => { mounted = false; };
  }, []);

  async function handleAddProduto(e) {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: novoProduto.name,
          sex: novoProduto.sex,
          quantity: Number(novoProduto.quantity),
          categoryId: novoProduto.categoryId,
          sizeId: novoProduto.sizeId,
        }),
      });
      if (!res.ok) throw new Error("Erro ao adicionar");
      const novo = await res.json();
      setItens((prev) => [...prev, novo]);
      setNovoProduto({ name: "", sex: "U", quantity: "", categoryId: "", sizeId: "" });
      setShowAddModal(false);
    } catch (err) {
      console.error("Erro ao adicionar produto:", err);
      alert("Erro ao adicionar produto. Verifique os campos e tente novamente.");
    }
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

  function openDeleteModal(item) {
    setItemToDelete(item);
    setShowDeleteModal(true);
  }

  function startEditProduto(item) {
    setEditId(item.id);
    setEditProduto({
      name: item.name,
      sex: item.sex,
      quantity: item.quantity,
      categoryId: item.category?.id || "",
      sizeId: item.size?.id || "",
    });
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditProduto((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  }

  async function saveEditProduto(id) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editProduto),
      });
      if (!res.ok) throw new Error("Erro ao editar");
      const updated = await res.json();
      setItens((prev) => prev.map((item) => (item.id === id ? updated : item)));
      setEditId(null);
      setEditProduto({ name: "", sex: "U", quantity: "", categoryId: "", sizeId: "" });
    } catch (err) {
      console.error("Erro ao editar produto:", err);
    }
  }

  function cancelEditProduto() {
    setEditId(null);
    setEditProduto({ name: "", sex: "U", quantity: "", categoryId: "", sizeId: "" });
  }

  return (
    <>
      <Navigation />
      <div className={styles.container}>
        <MenuBar hasNotification={hasNotification} />
        <main className={styles.main}>
          <h1 className={styles.titulo}>Controle de Estoque</h1>
          {fetchError && (
            <div style={{
              background: 'var(--color-bg-alt)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
            }}>
              Falha ao carregar dados: {fetchError}. Verifique se o backend está rodando em {BASE_API} e se o CORS permite conexões.
            </div>
          )}
          <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
            <button className={`${styles.btn} ${styles.btnAdicionar}`} onClick={() => setShowAddModal(true)}>
              + Adicionar Produto
            </button>
          </div>
          <table className={styles.tabela}>
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
              {itens.map((item) => (
                <tr key={item.id}>
                  {editId === item.id ? (
                    <>
                      <td>
                        <input className={styles.formInput} name="name" value={editProduto.name} onChange={handleEditChange} />
                      </td>
                      <td>
                        <select className={styles.formInput} name="categoryId" value={editProduto.categoryId} onChange={handleEditChange}>
                          <option value="">Selecione</option>
                          {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                        </select>
                      </td>
                      <td>
                        <select className={styles.formInput} name="sizeId" value={editProduto.sizeId} onChange={handleEditChange}>
                          <option value="">Selecione</option>
                          {sizes.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                        </select>
                      </td>
                      <td>
                        <select className={styles.formInput} name="sex" value={editProduto.sex} onChange={handleEditChange}>
                          <option value="M">Masculino</option>
                          <option value="F">Feminino</option>
                          <option value="U">Unissex</option>
                        </select>
                      </td>
                      <td>
                        <input className={styles.formInput} name="quantity" type="number" min={1} value={editProduto.quantity} onChange={handleEditChange} />
                      </td>
                      <td>
                        <button className={`${styles.btn} ${styles.btnAdicionar}`} onClick={() => saveEditProduto(item.id)}>Salvar</button>
                        <button className={`${styles.btn} ${styles.btnExcluir}`} onClick={cancelEditProduto}>Cancelar</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{item.name}</td>
                      <td>{item.category?.name || "-"}</td>
                      <td>{item.size?.name || "-"}</td>
                      <td>{item.sex === "M" ? "Masculino" : item.sex === "F" ? "Feminino" : "Unissex"}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <button className={`${styles.btn} ${styles.btnEditar}`} onClick={() => startEditProduto(item)}>Editar</button>
                        <button className={`${styles.btn} ${styles.btnExcluir}`} onClick={() => openDeleteModal(item)}>Excluir</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal Adicionar */}
          {showAddModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h2 className={styles.titulo} style={{ fontSize: "1.3rem", marginBottom: 16 }}>Adicionar Produto</h2>
                <form className={styles.formulario} onSubmit={handleAddProduto}>
                  <label className={styles.formLabel}>
                    Nome
                    <input className={styles.formInput} required value={novoProduto.name}
                      onChange={(e) => setNovoProduto({ ...novoProduto, name: e.target.value })} />
                  </label>
                  <label className={styles.formLabel}>
                    Categoria
                    <select className={styles.formInput} required value={novoProduto.categoryId}
                      onChange={(e) => setNovoProduto({ ...novoProduto, categoryId: e.target.value })}>
                      <option value="">Selecione uma categoria</option>
                      {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                    </select>
                  </label>
                  <label className={styles.formLabel}>
                    Tamanho
                    <select className={styles.formInput} required value={novoProduto.sizeId}
                      onChange={(e) => setNovoProduto({ ...novoProduto, sizeId: e.target.value })}>
                      <option value="">Selecione um tamanho</option>
                      {sizes.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                    </select>
                  </label>
                  <label className={styles.formLabel}>
                    Sexo
                    <select className={styles.formInput} value={novoProduto.sex}
                      onChange={(e) => setNovoProduto({ ...novoProduto, sex: e.target.value })}>
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                      <option value="U">Unissex</option>
                    </select>
                  </label>
                  <label className={styles.formLabel}>
                    Quantidade
                    <input className={styles.formInput} required type="number" min={1} value={novoProduto.quantity}
                      onChange={(e) => setNovoProduto({ ...novoProduto, quantity: e.target.value })} />
                  </label>
                  <div className={styles.modalBotoes}>
                    <button type="button" className={`${styles.btn} ${styles.btnExcluir}`} onClick={() => setShowAddModal(false)}>Cancelar</button>
                    <button type="submit" className={`${styles.btn} ${styles.btnAdicionar}`}>Adicionar</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal Excluir */}
          {showDeleteModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h2 className={styles.titulo} style={{ fontSize: "1.3rem", marginBottom: 16 }}>Confirmar Exclusão</h2>
                <p>Tem certeza que deseja excluir o produto <b>{itemToDelete?.name}</b>?</p>
                <div className={styles.modalBotoes}>
                  <button className={`${styles.btn} ${styles.btnExcluir}`} onClick={() => setShowDeleteModal(false)}>Não</button>
                  <button className={`${styles.btn} ${styles.btnAdicionar}`} onClick={handleDeleteProduto}>Sim</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}