"use client";
import React, { useState } from 'react';
import styles from './menuBar.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function MenuBar({ hasNotification }) {
  const router = useRouter();
  
  // Estado para controlar se o "retangulozinho" está aberto ou fechado
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear(); 
    sessionStorage.clear();
    router.push('/');
  };

  const toggleMenu = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className={styles.menuBar}>
      <div className={styles.rightSection}>
        
        {/* Ao clicar na área do usuário, ele abre ou fecha o menu */}
        <div 
          className={styles.userInfo} 
          onClick={toggleMenu}
          style={{ cursor: 'pointer', position: 'relative' }} 
        >
          <UserIcon />
          <span className={styles.userName}>Fulano da Silva</span>
          <span className={styles.arrowDown} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
            ▼
          </span>

          {/* O Retangulozinho de Sair! */}
          {isDropdownOpen && (
            <div 
              onClick={handleLogout}
              style={{
                position: 'absolute',
                top: '120%', /* Fica logo abaixo do nome */
                right: '0',
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#d32f2f', /* Vermelho suave para indicar ação de sair */
                fontWeight: '600',
                zIndex: 1000,
                minWidth: '120px'
              }}
            >
              <LogoutIcon />
              Sair
            </div>
          )}
        </div>
        
        <div className={styles.iconWrapper} style={{ position: 'relative' }}>
          {/* Espaço para notificações */}
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

function LogoutIcon() {
    return (
        <Image
            src="/logout-icon.png"
            alt="Logout"
            width={20}
            height={20}
        />
    );
}