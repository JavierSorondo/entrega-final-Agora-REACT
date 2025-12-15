import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createUser, getUserByEmail, updateRequests, getAllUsers as getAllUsersService } from "./userService.js"; 

/**
 * AuthContext centraliza:
 * - usuario (objeto tal como viene de MockAPI)
 * - requests (array en memoria): IDs de libros solicitados
 * - funciones: login, logout, createUser, addRequest, removeRequest, clearRequests, getAllUsers
 */

const AuthContext = createContext();

function parseRequestsString(reqString) {
    if (!reqString) return [];
    if (Array.isArray(reqString)) return reqString.map(String);
    return String(reqString)
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
}

function stringifyRequestsArray(arr) {
    if (!arr || arr.length === 0) return "";
    return arr.join(",");
}

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [mostrarLogin, setMostrarLogin] = useState(false);
    const toggleLogin = () => setMostrarLogin((prev) => !prev);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        setLoading(false);
    }, []);

    async function login(email, password) {
        try {
            const foundUser = await getUserByEmail(email); 
            if (!foundUser || foundUser.password !== password) {
                return { ok: false, message: "Email o contraseña incorrectos" };
            }
            const reqs = parseRequestsString(foundUser.requests);
            setUsuario(foundUser);
            setRequests(reqs);
            toast.success(`Bienvenido, ${foundUser.nombre}`);
            return { ok: true };
        } catch (error) {
            console.error("Error al intentar logear:", error);
            return { ok: false, message: "Error de red o servidor" };
        }
    }

    function logout() {
        setUsuario(null);
        setRequests([]); // Limpiamos el carrito
        toast.info("Sesión cerrada");
    }

    async function createUser(newUser) {
        try {
            // Evitamos duplicados por email
            const exists = await getUserByEmail(newUser.email);
            if (exists) {
                return { ok: false, message: "Este email ya está registrado." };
            }
            
            const created = await createUser(newUser); 
            toast.success(`Registro exitoso para ${created.nombre}`);
            return { ok: true, data: created };

        } catch (error) {
            console.error("Error creando usuario:", error);
            return { ok: false, message: error.message || "Error al registrar" };
        }
    }
    
    async function getAllUsers() {
        // Un usuario debe ser Admin para ver esta lista
        if (!usuario?.isAdmin) {
            toast.error("Acceso denegado: Se requieren permisos de administrador.");
            return { ok: false, message: "No autorizado" };
        }

        try {
            const users = await getAllUsersService(); // Llama a la función del servicio
            // Retorna los datos y un estado 'ok' para manejar errores
            return { ok: true, data: users };
        } catch (error) {
            console.error("Error obteniendo todos los usuarios:", error);
            toast.error("Error al cargar la lista de usuarios del servidor.");
            return { ok: false, message: error.message || "Error al cargar usuarios" };
        }
    }

    async function persistRequestsToBackend(updatedRequestsArray) {
        if (!usuario || !usuario.id) {
            console.warn("persistRequestsToBackend: no hay usuario logueado");
            return { ok: false, message: "No hay usuario logueado" };
        }

        const requestsString = stringifyRequestsArray(updatedRequestsArray);

        try {
            // Persistencia (uso de Servicio): Guarda en la base de datos
            const updatedUserFromApi = await updateRequests(usuario.id, requestsString);

            // Lógica de Contexto: Actualizar estado local
            const finalUser = { ...usuario, ...updatedUserFromApi }; 
            setUsuario(finalUser);

            return { ok: true, data: updatedUserFromApi };
        } catch (error) {
            console.error("Error al persistir requests:", error);
            return { ok: false, message: error.message || "Error de red" };
        }
    }

    // Las funciones addRequest, removeRequest, y clearRequests 
    // administran las solicitudes en memoria y las persisten usando el servicio.

    async function addRequest(libroId) {
        if (!usuario) {
            toast.warning("Debes iniciar sesión para agregar solicitudes");
            return { ok: false, message: "No autenticado" };
        }

        const idStr = String(libroId);
        if (requests.includes(idStr)) {
            toast.info("Este libro ya está en tu lista de solicitudes.");
            return { ok: false, message: "Ya agregado" };
        }

        const updated = [...requests, idStr];

        const res = await persistRequestsToBackend(updated);
        if (!res.ok) {
            toast.error("Error al guardar la solicitud.");
            return { ok: false, message: res.message || "Error guardando" };
        }

        setRequests(updated);
        toast.success("Solicitud añadida con éxito.");
        return { ok: true };
    }

    async function removeRequest(libroId) {
        if (!usuario) {
            return { ok: false, message: "No autenticado" };
        }
        const idStr = String(libroId);
        const updated = requests.filter((r) => r !== idStr);

        const res = await persistRequestsToBackend(updated);
        if (!res.ok) {
            toast.error("Error al eliminar la solicitud.");
            return { ok: false, message: res.message || "Error guardando" };
        }

        setRequests(updated);
        toast.info("Solicitud eliminada.");
        return { ok: true };
    }

    async function clearRequests() {
        if (!usuario) {
            return { ok: false, message: "No autenticado" };
        }

        const res = await persistRequestsToBackend([]);
        if (!res.ok) {
            toast.error("Error al vaciar las solicitudes.");
            return { ok: false, message: res.message || "Error guardando" };
        }

        setRequests([]);
        toast.success("Todas las solicitudes han sido borradas.");
        return { ok: true };
    }
    
    // Si la aplicación está cargando (esperando estado inicial de autenticación)
    if (loading) {
        return <div className="p-8 text-center text-lg text-gray-600">Cargando aplicación...</div>;
    }

    return (
        <AuthContext.Provider
            value={{
                usuario,
                isAdmin: usuario?.isAdmin || false,
                login,
                logout,
                createUser,
                getAllUsers, // 🔑 Expuesto al hook useAuth()
                loading,
                mostrarLogin,
                toggleLogin,
                // carrito / requests
                requests, // array de ids (string)
                addRequest,
                removeRequest,
                clearRequests,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    return useContext(AuthContext);
}



