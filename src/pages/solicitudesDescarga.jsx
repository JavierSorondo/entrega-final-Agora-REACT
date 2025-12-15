import React, { useMemo } from "react";
import { useAuth } from "../authContext";
import "../styles/solicitudesDescarga.css";
import { toast } from "react-toastify";

export default function SolicitudesDescarga({
    libros = [],
    isModalOpen,
    closeModal
}) {
    const { requests, removeRequest, clearRequests } = useAuth();

    const librosSolicitados = useMemo(() => {
        return requests
            .map((id) => libros.find((l) => String(l.id) === String(id)))
            .filter(Boolean);
    }, [requests, libros]);

    const handleRemove = async (id) => {
        const res = await removeRequest(id);
        if (res.ok) {
            toast.success("Elemento eliminado del carrito", {
                position: "top-center",
                autoClose: 1800,
                theme: "colored",
            });
        } else {
            toast.error(res.message || "Error al eliminar");
        }
    };

    const handleDownload = async () => {
        const res = await clearRequests();
        if (res.ok) {
            toast.success("Descarga realizada y carrito vaciado", {
                position: "top-center",
                autoClose: 2000,
                theme: "colored",
            });
            closeModal();
        } else {
            toast.error(res.message || "Error al vaciar carrito");
        }
    };

    if (!isModalOpen) return null;

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div
                className="solicitudes-modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Botón de cierre en la esquina */}
                <button className="modal-close-btn" onClick={closeModal}>
                    ×
                </button>

                <h3>Solicitudes de descarga</h3>

                {librosSolicitados.length > 0 ? (
                    <>
                        <ul>
                            {librosSolicitados.map((libro) => (
                                <li key={libro.id} className="solicitud-item">
                                    <span className="solicitud-titulo">
                                        {libro.titulo} — {libro.autor}
                                    </span>

                                    <button
                                        onClick={() => handleRemove(libro.id)}
                                        className="btn-remover"
                                    >
                                        Quitar
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="solicitudes-acciones">
                            <button className="btn-confirmar" onClick={handleDownload}>
                                Descargar y Vaciar
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="solicitudes-vacio">
                        No hay solicitudes.
                        <br />
                        <button
                            className="btn-remover"
                            style={{ marginTop: "10px" }}
                            onClick={closeModal}
                        >
                            Cerrar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

