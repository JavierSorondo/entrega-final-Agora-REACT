import React, { useState } from 'react';
import '../styles/bookcard.css'; 
import { Link } from 'react-router-dom';

function BookCard({ book, onSolicitarDescarga, isAdmin, onEdit }) { 
  const { id, titulo, autor, portada: imagenUrl } = book;
  const [imagenRota, setImagenRota] = useState(false); 

  const FALLBACK_ELEMENT = (
      <div className="fallback-text">
        <p>Portada no disponible</p>
      </div>
  );

  return (
    <div className="book-card-container">
      <div className="book-image-wrapper">
        
        {imagenRota || !imagenUrl ? (
          FALLBACK_ELEMENT
        ) : (
          <img 
            src={imagenUrl} 
            alt={`Portada de ${titulo}`} 
            className="book-cover" 
            onError={() => setImagenRota(true)} 
          />
        )}
      </div>
      
      <div className="book-info">
        <h3 className="book-title">{titulo}</h3>
        <p className="book-author">
          Por: <span>{autor}</span>
        </p>

        <div className="button-group">
          
          <Link to={`/resenas/${book.id}`} className="btn btn-review">
            Reseña
          </Link>
        
          <button 
            className="btn btn-download"
            onClick={onSolicitarDescarga} 
          > Solicitar Descarga
          </button>

          {isAdmin && ( // Si es admin, mostramos el botón de editar
            <button
              className="btn btn-edit" 
              onClick={() => onEdit(book)} 
            > Editar
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

export default BookCard;