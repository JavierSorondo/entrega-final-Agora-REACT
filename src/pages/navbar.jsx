import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../authContext";
import { FaDownload } from "react-icons/fa";
import NewUserModal from "./newUserModal";
import "../styles/navbar.css";

function DownloadIcon({ count, onIconClick }) {
    if (!count) return null;
    return (
        <button className="download-icon-btn" onClick={onIconClick} title="Solicitudes de descarga">
            <FaDownload />
            <span className="download-count">{count}</span>
        </button>
    );
}

export default function Navbar({ onOpenModal }) {
    const { usuario, logout, login, requests } = useAuth();

    const [mostrarLogin, setMostrarLogin] = useState(false);
    const [loginInfo, setLoginInfo] = useState({ user: "", password: "" });
    const [showNewUserModal, setShowNewUserModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const result = await login(loginInfo.user, loginInfo.password);

        if (result.ok) {
            setMostrarLogin(false);
            setLoginInfo({ user: "", password: "" });
            setErrorMessage("");
        } else {
            setErrorMessage(result.message || "Error al iniciar sesión");
        }
    };

    return (
        <header className="navbar-container">
            <h1>ÁGORA LITERARIA</h1>

            <nav>
                <ul>
                    <li><NavLink to="/inicio" className={({ isActive }) => isActive ? "active-link" : ""}>Inicio</NavLink></li>
                    <li><NavLink to="/busqueda" className={({ isActive }) => isActive ? "active-link" : ""}>Búsqueda</NavLink></li>
                    <li><NavLink to="/catalogo" className={({ isActive }) => isActive ? "active-link" : ""}>Catálogo</NavLink></li>
                    <li><NavLink to="/recomendaciones" className={({ isActive }) => isActive ? "active-link" : ""}>Recomendaciones</NavLink></li>
                    <li><NavLink to="/resenas" className={({ isActive }) => isActive ? "active-link" : ""}>Reseñas</NavLink></li>
                    <li><NavLink to="/contacto" className={({ isActive }) => isActive ? "active-link" : ""}>Contacto</NavLink></li>
                    {usuario?.isAdmin && (
                        <li><NavLink to="/admin" className={({ isActive }) => isActive ? "active-link" : ""}>Admin</NavLink></li>
                    )}
                </ul>
            </nav>

            <div className="navbar-icons">
                <DownloadIcon count={requests?.length || 0} onIconClick={onOpenModal} />

                {usuario ? (
                    <>
                        <span className="auth-welcome">Hola, {usuario?.nombre || usuario?.email}!</span>
                        <button className="btn-logout" onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <button className="btn-login-toggle" onClick={() => setMostrarLogin(v => !v)}>
                            Ingresar
                        </button>

                        {mostrarLogin && (
                            <form className="login-form-pop" onSubmit={handleLogin}>
                                <input
                                    type="text"
                                    placeholder="Email"
                                    value={loginInfo.user}
                                    onChange={(e) => setLoginInfo({ ...loginInfo, user: e.target.value })}
                                    required
                                />

                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    value={loginInfo.password}
                                    onChange={(e) => setLoginInfo({ ...loginInfo, password: e.target.value })}
                                    required
                                />
                                <p className="login-hint">Usuario de prueba: admin@admin.com / 123</p>

                                <button type="submit" className="btn-login">Entrar</button>

                                <button type="button" className="btn-new-user" onClick={() => setShowNewUserModal(true)}>
                                    Nuevo
                                </button>

                                {errorMessage && <p className="login-error">{errorMessage}</p>}
                            </form>
                        )}
                    </>
                )}

            </div>

            <NewUserModal isOpen={showNewUserModal} onClose={() => setShowNewUserModal(false)} />
        </header>
    );
}


