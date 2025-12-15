import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/resenas.css';

function ResenaDetalle({ libro, agregarASolicitudes }) {
    const navigate = useNavigate();

    if (!libro) {
        return <p className="resenas-error">Error interno: No se pudo cargar la información del libro.</p>;
    }

    const titulo = libro.titulo || 'Título Desconocido';
    const autor = libro.autor || 'Autor Desconocido';
    const anio = libro.anio || 'Año Desconocido';
    const lugar = libro.lugar || 'Lugar Desconocido';
    const genero = libro.genero || 'Género Desconocido';

    const reseñaCompleta = libro.resenia || `
    La obra "${titulo}" fue escrita por ${autor} en ${anio}, publicada originalmente en ${lugar}. Recomendamos este libro por su contribución al género de ${genero}. Su narrativa cautivadora y personajes bien desarrollados hacen de esta lectura una experiencia inolvidable. A lo largo de sus páginas, el autor explora temas profundos y universales que resuenan con lectores de todas las edades.
    En resumen, "${titulo}" es una obra maestra que merece ser leída y apreciada por su valor literario y su impacto cultural.
    `; // El texto de la reseña real o bien, lo inventamos...

    const manejarDescarga = () => {
        agregarASolicitudes(libro); 
    };

    return (
        <div className="resena-detalle-card">
            
            <button 
                className="btn-back" 
                onClick={() => navigate('/resenas')}
                title="Volver a la lista de reseñas disponibles"
            >
                ← Volver al Índice
            </button>
            
            <h1 className="resena-title">{libro.titulo}</h1>
            <h2 className="resena-author">Autor: {libro.autor}</h2>
            <h2 className="resena-place">Publicada en {libro.lugar}, en el año {libro.anio}. </h2>
            
            <img 
                src={libro.portada} 
                alt={`Portada de ${libro.titulo}`} 
                className="resena-cover"
            />

            <div className="resena-content">
                <h3>Reseña:</h3>
                
                <p className="resena-text">
                    {reseñaCompleta}
                </p>
                
                <button 
                    className="btn-download-resena"
                    onClick={manejarDescarga}
                    title={`Solicitar descarga`}
                >
                    Solicitar descarga
                </button>
                
            </div>
            
            <div style={{ clear: 'both' }}></div> 
        </div>
    );
}

export default ResenaDetalle;