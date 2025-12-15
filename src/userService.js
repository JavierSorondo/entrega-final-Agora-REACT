const API_URL = "https://68ebb9b076b3362414ce7c05.mockapi.io/Contactos";

export async function createUser(newUser) {
    const body = {
        ...newUser,
        mensaje: "",
        isUser: true,
        isAdmin: false,
        requests: "" // Carrito vacío (string) por defecto
    };

    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al crear usuario en el servidor");
    }

    return await res.json();
}

/**
 * Busca un usuario por email.
 * @param {string} email
 * @returns {Promise<object | null>} El objeto del usuario si existe, o null.
 */
export async function getUserByEmail(email) {
    const res = await fetch(API_URL);
    if (!res.ok) {
        throw new Error("Error al obtener usuarios de la API");
    }
    
    const data = await res.json();
    return data.find((u) => u.email && u.email.toLowerCase() === email.toLowerCase()) || null;
}

/**
 * Función para obtener *todos* los usuarios.
 * @returns {Promise<Array<object>>} Lista de todos los usuarios.
 */
export async function getAllUsers() {
    const res = await fetch(API_URL);
    if (!res.ok) {
        throw new Error("Error al obtener la lista de usuarios del servidor.");
    }
    return await res.json();
}

/**
 * Función para actualizar un usuario existente (CRUD: Update).
 * @param {string} userId - ID de MockAPI del usuario.
 * @param {object} updatedData - Datos a actualizar (ej: { nombre, email, isAdmin, password }).
 * @returns {Promise<object>} El objeto del usuario actualizado.
 */
export async function updateUser(userId, updatedData) {
    const res = await fetch(`${API_URL}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al actualizar el usuario.");
    }

    return await res.json();
}

/**
 * Función para eliminar un usuario (CRUD: Delete).
 * @param {string} userId - ID de MockAPI del usuario.
 * @returns {Promise<void>}
 */
export async function deleteUser(userId) {
    const res = await fetch(`${API_URL}/${userId}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al eliminar el usuario.");
    }
}

/**
 * Función para actualizar solo el campo 'requests' de un usuario.
 * @param {string} userId - ID de MockAPI del usuario.
 * @param {string} requestsString - Lista de IDs separadas por comas.
 * @returns {Promise<object>} El objeto del usuario actualizado.
 */
export async function updateRequests(userId, requestsString) {
    const res = await fetch(`${API_URL}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requests: requestsString }),
    });

    if (!res.ok) {
        throw new Error("Error al guardar las solicitudes en el servidor");
    }

    return await res.json();
}

