import { useState, useEffect } from "react";

const LIBROS_API_URL = "https://68ebb9b076b3362414ce7c05.mockapi.io/Libros";

export default function useLibros() {
    const [libros, setLibros] = useState([]); // Renombramos a 'libros'
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(LIBROS_API_URL, { signal })
        .then((respuesta) => {
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        return respuesta.json();
    })
    .then((datos) => {
        setLibros(datos);
        setCargando(false);
    })
    .catch((err) => {
        if (err.name !== 'AbortError') {
            console.error("Fallo al obtener los libros:", err);
            setError("Hubo un problema al cargar la biblioteca.");
            setCargando(false);
        }
    });
    
    return () => controller.abort();
    
}, []);


return { libros, cargando, error }; 
}

