import MenuBar from '../components/menubar/menubar';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../components/navegation/navegation';
import styles from './home.module.css';
import { FaHome, FaUserPlus, FaBoxes, FaHandHoldingHeart, FaUsers, FaUserFriends, FaChartBar, FaCog } from 'react-icons/fa';

export default function Home() {
  // Simulação: troque para true/false para testar
  const hasNotification = true;

  // Opções de navegação para o grid (removido Usuários e Cadastro)
  const navOptions = [
    { href: '/home', label: 'Home', icon: <FaHome /> },
    { href: '/estoque', label: 'Estoque', icon: <FaBoxes /> },
    { href: '/cadastrodoador/lista', label: 'Doadores', icon: <FaHandHoldingHeart /> },
    { href: '/cadastrobeneficiario/lista', label: 'Beneficiários', icon: <FaUsers /> },
    { href: '/cadastrovoluntario/lista', label: 'Voluntários', icon: <FaUserFriends /> },
    { href: '/relatorios', label: 'Relatórios', icon: <FaChartBar /> },
    { href: '/configuracoes', label: 'Configurações', icon: <FaCog /> },
  ];

  return (
    <div className={styles.container}>
      <Navigation />
      <MenuBar hasNotification={hasNotification} />
      <main className={styles.main}>
        <Image
          src="/doantion.jpg"
          alt="Doação"
          width={320}
          height={180}
          className={styles.donationImage}
          priority
        />
        <h1 className={styles.title}>Bem-vindo à Sanem!</h1>
        <p className={styles.effectPhrase}>
          "A solidariedade transforma vidas. Doe hoje e faça a diferença!"
        </p>
        <div className={styles.gridNav}>
          {navOptions.map((opt) => (
            <Link key={opt.href} href={opt.href} className={styles.gridNavItem}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {opt.icon}
                {opt.label}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
} 