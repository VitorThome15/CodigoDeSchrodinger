"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './navegation.module.css';
import { FaHome, FaUserPlus, FaBoxes, FaHandHoldingHeart, FaUsers, FaUserFriends, FaChartBar, FaCog, FaUser, FaQuestionCircle, FaMoon, FaSun } from 'react-icons/fa';

const menuIcons = {
    Home: <FaHome />,
    Dashboard: <FaChartBar />,
    Cadastro: <FaUserPlus />,
    Estoque: <FaBoxes />,
    Doadores: <FaHandHoldingHeart />,
    Beneficiários: <FaUsers />,
    Voluntários: <FaUserFriends />,
    Relatórios: <FaChartBar />,
    Configurações: <FaCog />,
    Usuários: <FaUser />,
    Ajuda: <FaQuestionCircle />,
};

export default function Navigation() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = window.localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        setIsDarkMode(theme === 'dark');
        document.documentElement.setAttribute('data-theme', theme);
    }, []);

    function toggleTheme() {
        const nextTheme = isDarkMode ? 'light' : 'dark';
        setIsDarkMode(!isDarkMode);
        document.documentElement.setAttribute('data-theme', nextTheme);
        window.localStorage.setItem('theme', nextTheme);
    }

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <Image src="/logo-sanem.svg" alt="Sanem" width={80} height={80} />
                <div className={styles.logoText}></div>
            </div>
            <div className={styles.sectionTitle}>MENU</div>
            <nav className={styles.menuSection}>
                <Link href="/home" className={styles.menuItem}>{menuIcons.Home} Home</Link>
                <Link href="/dashboard" className={styles.menuItem}>{menuIcons.Dashboard} Dashboard</Link>
                <Link href="/cadastrooption" className={styles.menuItem}>{menuIcons.Cadastro} Cadastro</Link>
                <Link href="/estoque" className={styles.menuItem}>{menuIcons.Estoque} Estoque</Link>
                <Link href="/cadastrodoador/lista" className={styles.menuItem}>{menuIcons.Doadores} Doadores</Link>
                <Link href="/cadastrobeneficiario/lista" className={styles.menuItem}>{menuIcons.Beneficiários} Beneficiários</Link>
                <Link href="/cadastrovoluntario/lista" className={styles.menuItem}>{menuIcons.Voluntários} Voluntários</Link>
            </nav>
            <div className={styles.sidebarFooter}>
                <button type="button" className={styles.themeButton} onClick={toggleTheme} aria-label="Alternar modo escuro">
                    {isDarkMode ? <FaSun /> : <FaMoon />}
                    <span>{isDarkMode ? 'Modo claro' : 'Modo escuro'}</span>
                </button>
            </div>
        </aside>
    );
}
