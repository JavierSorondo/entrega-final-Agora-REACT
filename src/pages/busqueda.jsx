import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useLibros from '../useLibros.js';
import '../styles/busqueda.css'; 

const agruparResultados = (libros, query) => {
  
  if (!query) return {};
  const termino = query.toLowerCase().trim();
  if (termino.length < 3) return {}; // establece la minima longitud para buscar
  const resultadosAgrupados = {
    porTitulo: [],
    porAutor: [],
    porTema: []
  };
    
  // registro para evitar duplicados si un libro coincide en múltiples categorías
  const idsAgregados = new Set();

  libros.forEach(libro => {
    const titulo = libro.titulo ? libro.titulo.toLowerCase() : '';
    const autor = libro.autor ? libro.autor.toLowerCase() : '';
    const tema = libro.genero ? libro.genero.toLowerCase() : ''; // Usando 'genero' como 'tema'

    // Verificar coincidencia por Título
    if (titulo.includes(termino)) {
      if (!idsAgregados.has(libro.id)) {
        resultadosAgrupados.porTitulo.push(libro);
        idsAgregados.add(libro.id);
      }
    }
        
    // Verificar coincidencia por Autor
    if (autor.includes(termino)) {
      if (!idsAgregados.has(libro.id)) {
        resultadosAgrupados.porAutor.push(libro);
        idsAgregados.add(libro.id);
      }
    }

    // Verificar coincidencia por Tema/Género
    if (tema.includes(termino)) {
      if (!idsAgregados.has(libro.id)) {
        resultadosAgrupados.porTema.push(libro);
        idsAgregados.add(libro.id);
      }
    }
  });

  return resultadosAgrupados;
};


function Busqueda() {
  const { libros, cargando, error } = useLibros();
  const [query, setQuery] = useState('');
    
  // Usa useMemo para recalcular los resultados solo cuando 'libros' o 'query' cambien
  const resultados = useMemo(() => agruparResultados(libros, query), [libros, query]);

  if (error) return <p className="busqueda-error">❌ Error: No se pudieron cargar los datos.</p>;

  // Determinar si hay resultados en alguna de las categorías
  const hayResultados = Object.values(resultados).some(arr => arr.length > 0);
    
  // Mapeo de categorías para renderizado
  const categorias = [
    { key: 'porTitulo', nombre: 'Coincidencia por Título' },
    { key: 'porAutor', nombre: 'Coincidencia por Autor' },
    { key: 'porTema', nombre: 'Coincidencia por Tema/Género' },
  ];


  return (
    <div className="busqueda-container">
      <h2 className="section-title">Encuentra tu Obra</h2>
            
      <input 
        type="text" 
        placeholder="Busca por Título, Autor o Tema..." 
        className="busqueda-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
            
      {cargando && <p>Buscando...</p>}

      {/* Renderizado de Resultados */}
      <div className="resultados-list">
        {query.length > 0 && !hayResultados && !cargando && (
        <p className="no-results">No se encontraron coincidencias para "{query}".</p>
        )}
                
        {categorias.map(categoria => {
          const lista = resultados[categoria.key];
          if (lista && lista.length > 0) {
            return (
              <div key={categoria.key} className="resultados-grupo">
                <h3>{categoria.nombre} ({lista.length})</h3>
                <ul className="libros-agrupados">
                  {lista.map(libro => (
                    <li key={libro.id} className="libro-item">
                      <span className="item-info">
                      **{libro.titulo}** por {libro.autor}
                      </span>
                      <Link to={`/resenas/${libro.id}`} className="btn-reseña-small"> Ver Reseña </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          }
        return null;
      })}
      </div>
    </div>
  );
}

export default Busqueda;