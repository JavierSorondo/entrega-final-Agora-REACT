import React, { useState, useEffect } from 'react';
import { useAuth } from '../authContext.jsx';


// Estas funciones se usarán para gestionar USUARIOS y también para actualizar el estado 'leido' de los MENSAJES.
import { createUser, updateUser, deleteUser, getAllUsers } from '../userService.js';
import { createBook, updateBook, deleteBook, getAllBooks } from '../bookService.js';
import '../styles/adminPanel.css';
import { toast } from 'react-toastify';

// Las solicitudes de descarga están almacenadas como una cadena de IDs separadas por comas (en el campo 'requests').
// Esta función cuenta cuántas solicitudes hay en esa cadena.
const getRequestCount = (requestsValue) => {
const requestsString = String(requestsValue || '');
    return requestsString
    .split(',')
    .filter(id => id.trim() !== '')
    .length;
};


// Formulario CRUD genérico tanto para usuarios como para libros.
const CrudForm = ({ item, type, onSubmit, onCancel }) => {
const isUser = type === 'user'; //Si type es 'user', isUser es true.
const initialFormState = isUser
    ? { nombre: '', email: '', isAdmin: false, password: '', ...item }
    : { titulo: '', autor: '', lugar: '', anio: '', portada: '', genero: '', resenia: '', ...item 
}; //por defecto todos los campos vacíos, si item tiene datos los sobreescribe.
    
//  Borramos los passwords del estado inicial para que el admin no los vea.
if (item && isUser) {
    delete initialFormState.password;
}

const [formData, setFormData] = useState(initialFormState);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const formTitle = item ? `Editar ${isUser ? 'Usuario' : 'Libro'}: ${isUser ? (item.nombre || item.email) : item.titulo}` : `Crear Nuevo ${isUser ? 'Usuario' : 'Libro'}`;

    return (
        <div className="modal-overlay">
            <form onSubmit={handleSubmit} className="crud-form">
                <h3 className="form-title">{formTitle}</h3>
                
                {isUser ? (
                    <>
                        <label>Nombre: <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required /></label>
                        <label>Email: <input type="email" name="email" value={formData.email} onChange={handleChange} required /></label>
                        <label className="checkbox-label">
                            <input type="checkbox" name="isAdmin" checked={formData.isAdmin} onChange={handleChange} />
                            Es Administrador
                        </label>
                        <label>Contraseña: <input type="password" name="password" value={formData.password || ''} onChange={handleChange} required={!item} placeholder={item ? 'Dejar vacío para no cambiar' : ''} /></label>
                    </>
                ) : (
                    // Contenedor de dos columnas para libros
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
                )}
                
                {/* Botones al pie del formulario */}
                <div className="form-actions">
                    <button type="submit" className="button-primary">{item ? 'Guardar Cambios' : 'Crear'}</button>
                    <button type="button" onClick={onCancel} className="button-secondary">Cancelar</button>
                </div>
            </form>
        </div>
    );
};


function AdminPanel() {
    const { usuario: currentAdmin, getAllUsers: fetchAllUsersFromContext } = useAuth();

    // Estado de la pestaña activa ('users', 'books', o 'msg')
    const [activeTab, setActiveTab] = useState('users');

    // Estados
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para CRUD
    const [editingUser, setEditingUser] = useState(null);
    const [editingBook, setEditingBook] = useState(null);
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [isCreatingBook, setIsCreatingBook] = useState(false);


    //  Los handlers de carga son tres funciones identicas, solo diferenciadas por el tipo de dato que cargan.
    // Queda por ver la posibilidad de unificar en un solo handler con parámetros.

    const loadUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Usamos authContext para validar permisos y cargar
            const result = await fetchAllUsersFromContext();
            if (result.ok) {
                // Filtramos solo los elementos donde isUser es TRUE
                const actualUsers = result.data.filter(item => item.isUser === true);
                setUsers(actualUsers); 
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError("Error de red al cargar usuarios.");
        } finally {
        setIsLoading(false);
        }
    };
    
    const loadMessages = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Usamos getAllUsers porque los mensajes están en la misma tabla que los usuarios
            const allItems = await getAllUsers(); 
            // Filtramos solo los elementos donde isUser es FALSE (los mensajes)
            const actualMessages = allItems.filter(item => item.isUser === false);
            setMessages(actualMessages);
        } catch (err) {
            setError("Error al cargar los mensajes de contacto.");
        } finally {
            setIsLoading(false);
        }
    };

    const loadBooks = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const loadedBooks = await getAllBooks();
            setBooks(loadedBooks);
        } catch (err) {
            setError("Error al cargar el catálogo de libros.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!currentAdmin?.isAdmin) {
            setIsLoading(false);
            setError("Acceso no autorizado.");
            return;
        }
        if (activeTab === 'users') {
            loadUsers();
        } else if (activeTab === 'books') {
            loadBooks();
        } else if (activeTab === 'msg') {
            loadMessages();
        }
    }, [activeTab, currentAdmin, fetchAllUsersFromContext]); 

    // Handlers de CRUD de USUARIOS 
    const handleUserSubmit = async (formData) => {
        try {
            let result;
            if (formData.id) {
                const { id, password, ...rest } = formData;
                const dataToSend = password ? formData : rest;
                // Prevenir que el admin actual se quite a sí mismo el rol de admin
                if (id === currentAdmin.id && !formData.isAdmin) {
                    toast.error("No puedes quitarte el rol de administrador a ti mismo.");
                    return;
                }
                result = await updateUser(id, dataToSend);
                setUsers(users.map(u => (u.id === result.id ? result : u)));
                toast.success(`Usuario ${result.nombre} actualizado.`);
            } else {
                result = await createUser(formData); 
                setUsers([...users, result]);
                toast.success(`Usuario ${result.nombre} creado.`);
            }
            setEditingUser(null);
            setIsCreatingUser(false);
        } catch (err) {
            toast.error(err.message || "Error en la operación de usuario.");
        }
    };
    
    const handleUserDelete = async (userId, userName) => {
        if (userId === currentAdmin.id) {
            toast.error("No puedes eliminar al administrador actual.");
            return;
        }
        // Habría que usar un modal más del estilo de la app en lugar de window.confirm
        if (window.confirm(`¿Estás seguro de eliminar al usuario ${userName}? Esta acción es irreversible.`)) {
            try {
                await deleteUser(userId);
                setUsers(users.filter(u => u.id !== userId));
                toast.success(`Usuario ${userName} eliminado.`);
            } catch (err) {
                toast.error(err.message || "Error al eliminar usuario.");
            }
        }
    };
    
    // Handler de MENSAJES 
    const handleMarkAsRead = async (message) => {
        try {
            // Usamos updateUser de userService para actualizar el campo 'leido'
            const updatedMessage = await updateUser(message.id, { leido: true });
            setMessages(messages.map(m => (m.id === updatedMessage.id ? updatedMessage : m)));
            toast.success(`Mensaje de ${message.nombre} marcado como leído.`);
        } catch (err) {
            toast.error(err.message || "Error al marcar mensaje como leído.");
        }
    };


    // Handlers de CRUD de LIBROS

    const handleBookSubmit = async (formData) => {
        try {
            let result;
            if (formData.anio) {
                // Asegura que es un número entero. Si la entrada es "2025", se convierte a 2025.
                formData.anio = parseInt(formData.anio, 10); 
            }
            if (formData.id) {
                result = await updateBook(formData.id, formData);
                setBooks(books.map(b => (b.id === result.id ? result : b)));
                toast.success(`Libro ${result.titulo} actualizado.`);
            } else {
                result = await createBook(formData);
                setBooks([...books, result]);
                toast.success(`Libro ${result.titulo} creado.`);
            }
            setEditingBook(null);
            setIsCreatingBook(false);
        } catch (err) {
            toast.error(err.message || "Error en la operación de libro.");
        }
    };

    const handleBookDelete = async (bookId, bookTitle) => {
        if (window.confirm(`¿Estás seguro de eliminar el libro ${bookTitle}? Esta acción es irreversible.`)) {
            try {
                await deleteBook(bookId);
                setBooks(books.filter(b => b.id !== bookId));
                toast.success(`Libro ${bookTitle} eliminado.`);
            } catch (err) {
                toast.error(err.message || "Error al eliminar libro.");
            }
        }
    };

    //  Renderizado de Tablas de Usuarios y Libros
    const renderUserTable = () => (
        <>
            <button className="button-add" onClick={() => setIsCreatingUser(true)}>+ Agregar Nuevo Usuario</button>
            <div className="table-responsive">
                <table className="crud-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Solicitudes</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.nombre}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`role-tag ${user.isAdmin ? 'tag-admin' : 'tag-user'}`}>
                                        {user.isAdmin ? 'ADMINISTRADOR' : 'USUARIO'}
                                    </span>
                                </td>
                                <td>{getRequestCount(user.requests)}</td>
                                <td>
                                    <button className="button-edit" onClick={() => setEditingUser(user)}>Editar</button>
                                <   button className="button-delete" onClick={() => handleUserDelete(user.id, user.nombre)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isCreatingUser && (
                <CrudForm 
                    type="user" 
                    item={{isAdmin: false}} 
                    onSubmit={handleUserSubmit} 
                    onCancel={() => setIsCreatingUser(false)} 
                />
            )}
            {editingUser && (
                <CrudForm 
                    type="user" 
                    item={editingUser} 
                    onSubmit={handleUserSubmit} 
                    onCancel={() => setEditingUser(null)} 
                />
            )}
        </>
    );
    
    const renderBookTable = () => (
        <>
            <button className="button-add" onClick={() => setIsCreatingBook(true)}>+ Agregar Nuevo Libro</button>
            <div className="table-responsive">
                <table className="crud-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Autor</th>
                            <th>Lugar</th>
                            <th>Año</th>
                            <th>URL Portada</th> 
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book => (
                            <tr key={book.id}>
                                <td>{book.id}</td>
                                <td>{book.titulo}</td>
                                <td>{book.autor}</td>
                                <td>{book.lugar}</td>
                                <td>{book.anio}</td>
                                <td className="image-url-cell">{book.portada}</td>
                                <td>
                                    <button className="button-edit" onClick={() => setEditingBook(book)}>Editar</button>
                                    <button className="button-delete" onClick={() => handleBookDelete(book.id, book.titulo)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isCreatingBook && (
                <CrudForm 
                    type="book" 
                    item={{}} 
                    onSubmit={handleBookSubmit} 
                    onCancel={() => setIsCreatingBook(false)} 
                />
            )}
            {editingBook && (
                <CrudForm 
                    type="book" 
                    item={editingBook} 
                    onSubmit={handleBookSubmit} 
                    onCancel={() => setEditingBook(null)} 
                />
            )}
        </>
    );

    // Renderizado de la pestaña de Mensajes 
    const renderMessageTable = () => {
        // Clasificamos leídos y no leídos
        const unreadMessages = messages
            .filter(msg => !msg.leido)
            .sort((a, b) => b.id - a.id); // Ordenar los más nuevos primero
        
        const readMessages = messages
            .filter(msg => msg.leido)
            .sort((a, b) => b.id - a.id);

        // Función auxiliar para renderizar una lista de mensajes
        const renderMessageList = (list, isUnread) => (
            list.map(msg => (
                <tr key={msg.id} className={isUnread ? 'message-unread' : 'message-read'}>
                    <td>{msg.id}</td>
                    <td>
                        <span className={`status-tag ${msg.leido ? 'tag-read' : 'tag-unread'}`}>
                            {msg.leido ? 'Leído' : 'NUEVO'}
                        </span>
                    </td>
                    <td>{msg.nombre}</td>
                    <td>{msg.email}</td>
                    <td className="message-content-cell">{msg.mensaje}</td>
                    <td>
                        {!msg.leido && (
                            <button 
                                className="button-primary" 
                                onClick={() => handleMarkAsRead(msg)}
                            >Marcar como leído</button>
                        )}
                    </td>
                </tr>
            ))
        );

        return (
            <>
                <div className="admin-message-info">
                    Hay <strong>{unreadMessages.length}</strong> mensajes sin leer.
                </div>
                
                <div className="table-responsive">
                    <table className="crud-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Estado</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Mensaje</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/*Mensajes sin leer */}
                            {unreadMessages.length > 0 ? (
                                renderMessageList(unreadMessages, true)
                            ) : (
                                <tr><td colSpan="6" className="table-empty-row">No hay mensajes nuevos.</td></tr>
                            )}
                            {/* Separación */}
                            {messages.length > 0 && (
                                <tr className="separator-row">
                                    <td colSpan="6">
                                        <hr className="message-separator"/>
                                        <p className="separator-text">Mensajes Leídos ({readMessages.length})</p>
                                        <hr className="message-separator"/>
                                    </td>
                                </tr>
                            )}
                            {/* Mensajes leídos */}
                            {readMessages.length > 0 ? (
                                renderMessageList(readMessages, false)
                            ) : unreadMessages.length === 0 ? (
                                <tr><td colSpan="6" className="table-empty-row">No hay mensajes leídos.</td></tr>
                            ) : null}
                            
                        </tbody>
                    </table>
                </div>
            </>
        );
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <p className="loading-text">Cargando datos de administración...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-box">
                <h1 className="error-title">Error de Carga</h1>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="admin-panel">
            <h1 className="admin-title">Panel de Administración</h1>
    
            {/* Pestañas de Navegación */}
            <div className="tab-navigation">
            <button
                className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}>
                Gestión de Usuarios
            </button>
            <button
                className={`tab-button ${activeTab === 'books' ? 'active' : ''}`}
                onClick={() => setActiveTab('books')}>
                Gestión de Libros
            </button>
            <button
                className={`tab-button ${activeTab === 'msg' ? 'active' : ''}`}
                    onClick={() => setActiveTab('msg')}>
                    Gestión de Mensajes
            </button>
        </div>
        {/* Contenido de la Pestaña */}
        <section className="admin-section">
            <h2 className="section-title">
            {activeTab === 'users' ? 'CRUD de Usuarios'
                : activeTab === 'books' ?'CRUD de Libros'
                : 'Mensajes de Contacto'}
            </h2>
                <div className="section-content">
                    {activeTab === 'users' ? renderUserTable()
                    : activeTab === 'books' ? renderBookTable()
                    : renderMessageTable()}
                </div>
            </section>
        </div>
    );
}

export default AdminPanel;
