import Link from 'next/link';
import Image from 'next/image';
import styles from './navegation.module.css';
import { FaHome, FaUserPlus, FaBoxes, FaHandHoldingHeart, FaUsers, FaUserFriends, FaChartBar, FaCog, FaUser, FaQuestionCircle } from 'react-icons/fa';

const menuIcons = {
    Home: <FaHome />,
    Dashboard: <FaChartBar />,
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
                <Link href="/estoque" className={styles.menuItem}>{menuIcons.Estoque} Estoque</Link>
                <Link href="/cadastrodoador/lista" className={styles.menuItem}>{menuIcons.Doadores} Doadores</Link>
                <Link href="/cadastrobeneficiario/lista" className={styles.menuItem}>{menuIcons.Beneficiários} Beneficiários</Link>
                <Link href="/cadastrovoluntario/lista" className={styles.menuItem}>{menuIcons.Voluntários} Voluntários</Link>
            </nav>
            <div className={styles.sectionTitle}>OTHERS</div>
            <nav className={styles.menuSection}>
                <Link href="/relatorios" className={styles.menuItem}>{menuIcons.Relatórios} Relatórios</Link>
                <Link href="/configuracoes" className={styles.menuItem}>{menuIcons.Configurações} Configurações</Link>
                <Link href="/usuarios" className={styles.menuItem}>{menuIcons.Usuários} Usuários</Link>
                <Link href="/ajuda" className={styles.menuItem}>{menuIcons.Ajuda} Ajuda</Link>
            </nav>
        </aside>
    );
}
