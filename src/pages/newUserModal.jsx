import React, { useState } from "react";
import { createUser, getUserByEmail } from "../userService";
import "../styles/newUserModal.css";

export default function NewUserModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const [form, setForm] = useState({
        nombre: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const validateEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.nombre || !form.email || !form.password) {
            return setError("Todos los campos son obligatorios");
        }

        if (!validateEmail(form.email)) {
            return setError("El email no es válido");
        }

        const exists = await getUserByEmail(form.email);
        if (exists) {
            return setError("Ya existe un usuario con ese email");
        }

        await createUser({
            nombre: form.nombre,
            email: form.email,
            password: form.password
        });

        alert("Usuario creado con éxito");
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Crear Nuevo Usuario</h3>

                {error && <p className="modal-error">{error}</p>}

                <label>Nombre</label>
                <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />

                <label>Email</label>
                <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <label>Contraseña</label>
                <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />

                <button className="btn-create" onClick={handleSubmit}>
                    Crear Usuario
                </button>

                <button className="btn-cancel" onClick={onClose}>
                    Cancelar
                </button>
            </div>
        </div>
    );
}


