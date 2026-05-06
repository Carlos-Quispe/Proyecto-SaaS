import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabaseClient';
import './Login.css';

export default function Login() {
  const { login, loginError, setLoginError } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setLoginError('Completa todos los campos');
      return;
    }
    setIsLoading(true);
    await login(username.trim(), password);
    setIsLoading(false);
  };

  return (
    <div className="login-page">
      {/* Background effects */}
      <div className="login-bg">
        <div className="login-bg__orb login-bg__orb--1" />
        <div className="login-bg__orb login-bg__orb--2" />
        <div className="login-bg__orb login-bg__orb--3" />
        <div className="login-bg__grid" />
      </div>

      <div className="login-container">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo__icon">
            <span>📦</span>
          </div>
          <h1 className="login-logo__title">Stock Manager</h1>
          <p className="login-logo__subtitle">SaaS de Gestión de Inventario y Ventas</p>
        </div>

        {/* Form card */}
        <form className="login-card" onSubmit={handleSubmit} id="login-form">
          <h2 className="login-card__heading">Iniciar Sesión</h2>
          <p className="login-card__desc">Ingresa tus credenciales para acceder al sistema</p>

          {loginError && (
            <div className="login-card__error" id="login-error">
              <span>⚠️</span>
              {loginError}
            </div>
          )}

          <div className="login-field">
            <label htmlFor="login-username" className="login-field__label">
              Usuario
            </label>
            <div className="login-field__input-wrap">
              <span className="login-field__icon">👤</span>
              <input
                id="login-username"
                type="text"
                className="login-field__input"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="login-password" className="login-field__label">
              Contraseña
            </label>
            <div className="login-field__input-wrap">
              <span className="login-field__icon">🔒</span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="login-field__input"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-field__toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`login-card__submit ${isLoading ? 'login-card__submit--loading' : ''}`}
            id="login-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="login-card__spinner" />
            ) : (
              <>Iniciar Sesión</>
            )}
          </button>
        </form>

        {!isSupabaseConfigured && (
        <div className="login-demo">
          <p className="login-demo__title">Cuentas de prueba:</p>
          <div className="login-demo__cards">
            <button
              className="login-demo__card"
              onClick={() => { setUsername('admin'); setPassword('1234'); }}
              type="button"
            >
              <span className="login-demo__avatar">👨‍💼</span>
              <div>
                <strong>Administrador</strong>
                <span>admin / 1234</span>
              </div>
            </button>
            <button
              className="login-demo__card"
              onClick={() => { setUsername('vendedor'); setPassword('1234'); }}
              type="button"
            >
              <span className="login-demo__avatar">👩‍💻</span>
              <div>
                <strong>Vendedor</strong>
                <span>vendedor / 1234</span>
              </div>
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
