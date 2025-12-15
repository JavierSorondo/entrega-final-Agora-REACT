const BOOKS_API_URL = "https://68ebb9b076b3362414ce7c05.mockapi.io/Libros";

export async function getAllBooks() {
    const res = await fetch(BOOKS_API_URL);
    if (!res.ok) {
        throw new Error("Error al obtener el catálogo de libros.");
    }
    return await res.json();
}

export async function createBook(newBookData) {
    console.log("Creando libro con datos:", JSON.stringify(newBookData));
    const res = await fetch(BOOKS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBookData),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al crear el libro.");
    }
    return await res.json();
}


export async function updateBook(bookId, updatedData) {
    // 1. Desestructuración para separar 'id' del resto de los datos.
    // Creamos una nueva variable 'id' (que ignoramos) 
    // y el resto de las propiedades se guardan en 'dataToSend'.
    const { id, ...dataToSend } = updatedData; 
    
    // Si bien 'id' aquí toma el valor que ya está en updatedData,
    // el objetivo principal es que 'dataToSend' ahora es un objeto
    // que contiene TODAS las propiedades de updatedData EXCEPTO 'id'.
    
    console.log("Actualizando libro con datos (sin ID):", JSON.stringify(dataToSend)); // <-- Verifica aquí
    console.log(`URL COMPLETA DEL PUT: ${BOOKS_API_URL}/${bookId}`);

    const res = await fetch(`${BOOKS_API_URL}/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend), // <-- ¡Aquí usamos dataToSend sin ID!
    });

    if (!res.ok) {
        const errorData = await res.json();
        // Si el body es vacío, errorData puede fallar. Mejorar el manejo del error 404:
        throw new Error(errorData?.message || `Error ${res.status} al actualizar el libro.`);
    }
    return await res.json();
}

/**
 * Elimina un libro (CRUD: Delete).
 * @param {string} bookId - ID del libro.
 * @returns {Promise<void>}
 */
export async function deleteBook(bookId) {
    const res = await fetch(`${BOOKS_API_URL}/${bookId}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al eliminar el libro.");
    }
}