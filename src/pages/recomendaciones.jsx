import React, { useMemo } from 'react';
import BookCard from './bookcard'; 
import useLibros from '../useLibros.js'; 
import '../styles/Recomendaciones.css'; 

const NUM_RECOMENDACIONES = 3;

function seleccionarAlAzar(arr, n) {
    if (!arr || arr.length === 0) return [];
    
    // Si el array es más pequeño que N, devolvemos todo el array
    if (arr.length <= n) return arr;

    const shuffled = arr.slice(); // Crear una copia superficial
    let i = arr.length;
    let temp, randIndex;

    // Aplicar el algoritmo de Fisher-Yates (mezcla)
    while (i !== 0) {
        randIndex = Math.floor(Math.random() * i);
        i--;

        // Intercambio
        temp = shuffled[i];
        shuffled[i] = shuffled[randIndex];
        shuffled[randIndex] = temp;
    }

    // Devolver los primeros N elementos mezclados
    return shuffled.slice(0, n);
}

function Recomendaciones({ agregarASolicitudes }) {
    const { libros, cargando, error } = useLibros();

    const recomendaciones = useMemo(() => {
        return seleccionarAlAzar(libros, NUM_RECOMENDACIONES);
    }, [libros]);

    if (cargando) return <p className="recomendaciones-loading">Buscando las mejores obras...</p>;
    if (error) return <p className="recomendaciones-error">❌ Error: No se pudieron cargar las recomendaciones.</p>;

    return (
        <div className="recomendaciones-container">
            <h2 className="section-title">✨ Recomendaciones Destacadas de la Sesión</h2>
            <div className="recomendaciones-grid">
                {recomendaciones.map(libro => (
                    // 🔑 CLAVE: Usar BookCard. El Link a la reseña ya está dentro de BookCard.
                    <BookCard 
                        key={libro.id} 
                        book={libro} 
                        onSolicitarDescarga={() => agregarASolicitudes(libro)}
                    />
                ))}
            </div>
        </div>
    );
}

export default Recomendaciones;