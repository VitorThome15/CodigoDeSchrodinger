'use client';

import { useState } from 'react';
import styles from './recuperar-senha.module.css';
import Link from 'next/link';

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [step, setStep] = useState(1); // Step 1: Enter email, Step 2: Reset password
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'

  const API_BASE = 'http://localhost:8080/api/auth/password-recovery';

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Por favor, insira um email válido');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setMessageType('success');
        // Armazenar o token recebido (simulando envio de email)
        setToken(data.token);
        setStep(2); // Avançar para próximo passo
      } else {
        setMessage(data.message || 'Erro ao solicitar recuperação de senha');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Erro:', error);
      setMessage('Erro ao conectar ao servidor. Verifique se o backend está rodando.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('As senhas não coincidem');
      setMessageType('error');
      setLoading(false);
      return;
    }

    if (newPassword.length < 4) {
      setMessage('Senha deve ter pelo menos 4 caracteres');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setMessageType('success');
        // Limpar formulário
        setEmail('');
        setToken('');
        setNewPassword('');
        setConfirmPassword('');
        // Redirecionar após 2 segundos
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setMessage(data.message || 'Erro ao redefinir senha');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Erro:', error);
      setMessage('Erro ao conectar ao servidor. Verifique se o backend está rodando.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Recuperar Senha</h1>

        {message && (
          <div className={`${styles.message} ${styles[messageType]}`}>
            {message}
          </div>
        )}

        {step === 1 ? (
          // Passo 1: Solicitar recuperação
          <form onSubmit={handleRequestReset}>
            <p className={styles.description}>
              Digite seu email para receber um token de recuperação de senha
            </p>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@example.com"
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              className={styles.button}
              disabled={loading}
            >
              {loading ? 'Processando...' : 'Solicitar Token de Recuperação'}
            </button>
          </form>
        ) : (
          // Passo 2: Redefinir senha
          <form onSubmit={handleResetPassword}>
            <p className={styles.description}>
              Insira sua nova senha abaixo
            </p>

            <div className={styles.tokenInfo}>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Token:</strong> {token.substring(0, 8)}...</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="newPassword">Nova Senha:</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite sua nova senha"
                disabled={loading}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirmar Senha:</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua nova senha"
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              className={styles.button}
              disabled={loading}
            >
              {loading ? 'Processando...' : 'Redefinir Senha'}
            </button>

            <button
              type="button"
              className={styles.buttonSecondary}
              onClick={() => {
                setStep(1);
                setMessage('');
                setToken('');
                setNewPassword('');
                setConfirmPassword('');
              }}
              disabled={loading}
            >
              Voltar
            </button>
          </form>
        )}

        <div className={styles.footer}>
          <Link href="/">Voltar ao login</Link>
        </div>
      </div>
    </div>
  );
}
