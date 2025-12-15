import React, { useState, useMemo } from 'react';
import useLibros from '../useLibros.js';
import BookCard from './bookcard.jsx';
import { useAuth } from '../authContext.jsx';
import BookFormModal from './bookFormModal';
import '../styles/catalogo.css'; 

const LIBROS_POR_PAGINA = 12; // 4 columnas * 3 filas

const ordenarLibros = (libros, criterio) => {
    if (!libros || !criterio) return libros;// Si no hay criterio o libros, devuelve la lista original

    const listaOrdenada = [...libros]; // Crear una copia para evitar modificar el mockapi
    
    listaOrdenada.sort((a, b) => {
        switch (criterio) {
            case 'titulo':
                return a.titulo.localeCompare(b.titulo);
            case 'autor':
                return a.autor.localeCompare(b.autor);
            case 'id':
                // Ordenar por ID (fecha de subida)
                return a.id - b.id;
            default:
                return 0;
        }
    });
    return listaOrdenada;
};

function Catalogo({ agregarASolicitudes }) {
    const { libros, cargando, error } = useLibros();

    // FUNCIONES PARA EDITAR LIBROS (solo admin)
    const { isAdmin } = useAuth(); // Para pasar a BookCard si es admin, así aparecen los botones de editar/borrar
    const [editingBook, setEditingBook] = useState(null); //Almacena el libro que se va a editar
    

    // FUNCIONES DE PAGINACIÓN Y ORDENAMIENTO
    const [paginaActual, setPaginaActual] = useState(1);
    const [criterioOrdenamiento, setCriterioOrdenamiento] = useState('id'); // ID por defecto

    const librosOrdenados = useMemo(() => {
        return ordenarLibros(libros, criterioOrdenamiento);
    }, [libros, criterioOrdenamiento]);

    // Cálculo de la paginación
    const indiceInicio = (paginaActual - 1) * LIBROS_POR_PAGINA;
    const indiceFin = indiceInicio + LIBROS_POR_PAGINA;
    const librosEnPagina = librosOrdenados.slice(indiceInicio, indiceFin);
    const totalPaginas = Math.ceil(librosOrdenados.length / LIBROS_POR_PAGINA);

    if (cargando) return <p className="catalogo-loading">Cargando catálogo...</p>;
    if (error) return <p className="catalogo-error">Error al cargar el catálogo: {error.message}</p>;

    return (
        <div className="catalogo-container">
            
            {/* 1. CONTROLES DE ORDENAMIENTO */}
            <div className="catalogo-controles">
                <label htmlFor="ordenar">Ordenar por:</label>
                <select 
                    id="ordenar" 
                    value={criterioOrdenamiento} 
                    onChange={(e) => {
                        setCriterioOrdenamiento(e.target.value);
                        setPaginaActual(1); // Resetear a la página 1 al cambiar el orden
                    }}
                    className="select-ordenar"
                >
                    <option value="id">Más Recientes (ID)</option>
                    <option value="titulo">Título (A-Z)</option>
                    <option value="autor">Autor (A-Z)</option>
                </select>
            </div>


            {/* 2. GRILLA DE LIBROS (Paginada y Ordenada) */}
            <div className="libros-grid">
                {librosEnPagina.map(libro => (
                    <BookCard 
                        key={libro.id}
                        book={libro}
                        onSolicitarDescarga={() => agregarASolicitudes(libro)} 
                        isAdmin={isAdmin}
                    />
                ))}
            </div>

            {/* 3. CONTROLES DE PAGINACIÓN */}
            {totalPaginas > 1 && (
                <div className="paginacion-controles">
                    <button
                        onClick={() => setPaginaActual(p => p - 1)}
                        disabled={paginaActual === 1}
                        className="btn-paginacion"
                    >
                        ← Anterior
                    </button>
                    
                    <span className="info-paginacion">
                        Página {paginaActual} de {totalPaginas}
                    </span>

                    <button
                        onClick={() => setPaginaActual(p => p + 1)}
                        disabled={paginaActual === totalPaginas}
                        className="btn-paginacion"
                    >
                        Siguiente →
                    </button>
                </div>
            )}
        </div>
    );
}

export default Catalogo;