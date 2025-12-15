
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import useLibros from '../useLibros.js';
import ResenaDetalle from './resenaDetalle.jsx'; 

function Resenas({ agregarASolicitudes }) {
    const { libroId } = useParams(); 
    
    const { libros, cargando, error } = useLibros(); 

    if (cargando) return <p className="resenas-loading">Cargando reseñas...</p>;
    if (error) return <p className="resenas-error">❌ {error}</p>;

    // Lógica 1: Mostrar reseña específica
    if (libroId) {
        const idText = String(libroId);
        const libroSeleccionado = libros.find(libro => libro.id === idText);

        if (!libroSeleccionado) {
            return <h2 className="resenas-not-found">Reseña no encontrada para el ID: {libroId}</h2>;
        }

        return (
            <ResenaDetalle 
            libro={libroSeleccionado}
            agregarASolicitudes={ agregarASolicitudes }
        />);
    }

    // Lógica 2: Mostrar la lista de reseñas
    return (
        <div className="resenas-list-container">
            <h1>Índice General de Reseñas</h1>
            {/* ... */}
            <ul className="resenas-list">
                {libros.map(libro => (
                    <li key={libro.id} className="resenas-list-item">
                        <Link to={`/resenas/${libro.id}`} className="resenas-list-link">
                            {libro.titulo} <span className="resenas-list-author">por {libro.autor}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Resenas;