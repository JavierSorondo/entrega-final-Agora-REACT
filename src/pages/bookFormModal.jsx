import React, { useState } from 'react';
import '../styles/adminPanel.css'; // Este componente es una separación tardía de adminPanel.jsx, por el momento usamos el mismo CSS. TODO: Crear uno específico.
// DE MOMENTO ESTE COMPONENTE NO ESTÁ EN USO, SIGUE DENTRO DE adminPanel.jsx
// LA SEPARACIÓN RESULTÓ MÀS COMPLEJA DE LO ESPERADO, SE HARÁ MÀS ADELANTE.

function BookFormModal({ book, onSubmit, onCancel }) {
    
    // Si 'book' existe (modo edición), usa sus datos; si es null (modo creación), usa vacíos.
    const initialFormState = book
        ? { titulo: '', autor: '', lugar: '', anio: '', portada: '', genero: '', resenia: '', ...book }
        : { titulo: '', autor: '', lugar: '', anio: '', portada: '', genero: '', resenia: '' };
        
    const [formData, setFormData] = useState(initialFormState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aseguramos que 'anio' sea un número entero
        if (formData.anio) {
            formData.anio = parseInt(formData.anio, 10);
        }
        onSubmit(formData);
    };

    const formTitle = book ? `Editar Libro: ${book.titulo}` : `Crear Nuevo Libro`;

    return (
        <div className="modal-overlay">
            <form onSubmit={handleSubmit} className="crud-form">
                <h3 className="form-title">{formTitle}</h3>
                
                <div className="book-form-grid">
                    {/* COLUMNA 1: Campos del Formulario */}
                    <div className="form-inputs">
                        <label>Título: <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required /></label>
                        <label>Autor: <input type="text" name="autor" value={formData.autor} onChange={handleChange} required /></label>
                        <label>Lugar: <input type="text" name="lugar" value={formData.lugar} onChange={handleChange} required /></label>
                        <label>Año: <input type="number" name="anio" value={formData.anio} onChange={handleChange} required /></label>
                        <label>Género: <input type="text" name="genero" value={formData.genero || ''} onChange={handleChange} /></label>
                        <label>URL Portada: <input type="url" name="portada" value={formData.portada || ''} onChange={handleChange} required /></label>
                    </div>
                    {/* COLUMNA 2: Previsualización de la imagen de portada */}
                    <div className="image-preview-column">
                        {formData.portada ? (
                            <div className="image-preview-container">
                                <h4>Previsualización de Portada:</h4>
                                <img src={formData.portada} alt="Vista previa de la portada" className="book-cover-preview"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150?text=Imagen+Fallida"; }} />
                            </div>
                        ) : (
                            <div className="image-preview-container no-image">
                                <h4>Previsualización de Portada:</h4>
                                <p>Ingrese una URL para ver la imagen.</p>
                            </div>
                        )}
                    </div>
                    {/* Reseña por fuera de las columnas */}
                    <div className="full-width-field">
                        <label>Reseña: <textarea name="resenia" value={formData.resenia || ''} onChange={handleChange} rows="3" /></label>
                    </div>
                </div>
                
                {/* Botones al pie del formulario */}
                <div className="form-actions">
                    <button type="submit" className="button-primary">{book ? 'Guardar Cambios' : 'Crear'}</button>
                    <button type="button" onClick={onCancel} className="button-secondary">Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default BookFormModal;