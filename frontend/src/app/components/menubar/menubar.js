"use client";
import styles from './menuBar.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaDoorOpen } from 'react-icons/fa';

export default function MenuBar({ hasNotification }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const pathname = usePathname();

  const menuItems = [
    { href: '/relatorios', label: 'Relatórios' },
    { href: '/configuracoes', label: 'Configurações' },
    { href: '/usuarios', label: 'Usuários' },
    { href: '/ajuda', label: 'Ajuda' },
  ];

  const pageMeta = getPageMeta(pathname);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  function handleLogout() {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (e) {
      // ignore
    }
    window.location.href = '/';
  }

  return (
    <header className={styles.menuBar}>
      <div className={styles.pageInfo}>
        <Link href="/home" className={styles.homeButton} aria-label="Voltar para a página inicial">
          <FaDoorOpen />
          <FaArrowLeft className={styles.homeButtonArrow} />
          <span>Início</span>
        </Link>

        <div className={styles.pageTitleBlock}>
          <span className={styles.pageKicker}>Página atual</span>
          <h1 className={styles.pageTitle}>{pageMeta.title}</h1>
          <p className={styles.pageSubtitle}>{pageMeta.subtitle}</p>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.userInfo} ref={ref} onClick={() => setOpen(v => !v)}>
          <UserIcon />
          <span className={styles.userName}>Fulano da Silva</span>
          <span className={styles.arrowDown}>▼</span>

          {open && (
            <div className={styles.dropdown} role="menu" onClick={e => e.stopPropagation()}>
              {menuItems.map(item => (
                <Link key={item.href} href={item.href} className={styles.dropdownItem} role="menuitem" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <div className={styles.dropdownDivider} />
              <button type="button" className={styles.dropdownButton} onClick={handleLogout} role="menuitem">
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function UserIcon() {
  return (
    <Image
      src="/user-icon.png"
      alt="User"
      width={24}
      height={24}
      style={{ marginRight: 12 }}
    />
  );
}

function getPageMeta(pathname) {
  const pages = [
    { match: '/home', title: 'Home', subtitle: 'Visão geral da plataforma' },
    { match: '/dashboard', title: 'Dashboard', subtitle: 'Indicadores e atividade recente' },
    { match: '/cadastrooption', title: 'Cadastro', subtitle: 'Escolha o tipo de cadastro' },
    { match: '/cadastrodoador/lista', title: 'Doadores', subtitle: 'Lista e manutenção de doadores' },
    { match: '/cadastrobeneficiario/lista', title: 'Beneficiários', subtitle: 'Lista e manutenção de beneficiários' },
    { match: '/cadastrovoluntario/lista', title: 'Voluntários', subtitle: 'Lista e manutenção de voluntários' },
    { match: '/estoque/editar', title: 'Editar estoque', subtitle: 'Ajuste os dados do item selecionado' },
    { match: '/estoque', title: 'Estoque', subtitle: 'Controle de itens e quantidades' },
    { match: '/doacoes', title: 'Doações', subtitle: 'Registro e acompanhamento de doações' },
    { match: '/relatorios', title: 'Relatórios', subtitle: 'Análises e exportação de dados' },
    { match: '/configuracoes', title: 'Configurações', subtitle: 'Preferências e ajustes do sistema' },
    { match: '/usuarios', title: 'Usuários', subtitle: 'Gerenciamento de usuários' },
    { match: '/ajuda', title: 'Ajuda', subtitle: 'Perguntas frequentes e suporte' },
    { match: '/acompanheduvidas', title: 'Acompanhe dúvidas', subtitle: 'Histórico e andamento das solicitações' },
  ];

  const current = pages.find(page => pathname === page.match || pathname.startsWith(`${page.match}/`));

  return current || { title: 'Sanem', subtitle: 'Gestão e acompanhamento' };
}
