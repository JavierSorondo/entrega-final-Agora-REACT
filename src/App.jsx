import React from "react";
import ScrollToTop from './pages/scrollToTop.jsx';
import Busqueda from './pages/busqueda.jsx';
import Inicio from './pages/inicio.jsx';
import Catalogo from './pages/catalogo.jsx';
import Recomendaciones from './pages/recomendaciones.jsx';
import Resenas from './pages/resenas.jsx';
import Contacto from './pages/contacto.jsx';
import Navbar from './pages/navbar.jsx';
import Footer from './pages/footer.jsx';
import SolicitudesDescarga from './pages/solicitudesDescarga.jsx';
import RutaProtegida from './pages/rutaProtegida.jsx';
import AdminPanel from './pages/adminPanel.jsx';

import useLibros from "./useLibros.js";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider, useAuth } from './authContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';



function AppContent() {
  const { usuario, requests, addRequest } = useAuth();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { libros } = useLibros();


  const agregarASolicitudes = async (libro) => {
    if (!usuario) {
      toast.warning("Debes iniciar sesión para agregar libros a solicitudes.", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    const idStr = String(libro.id);

    if (requests.includes(idStr)) {
      toast.info(`"${libro.titulo}" ya está en tu lista de solicitudes.`, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    const res = await addRequest(idStr);
    if (!res.ok) {
      toast.error(res.message || "Error al agregar solicitud");
      return;
    }
    setIsModalOpen(true);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  return (
    <>
      <ScrollToTop />
      <Navbar onOpenModal={openModal} />
      <SolicitudesDescarga
        libros={libros}
        isModalOpen={isModalOpen}
        closeModal={closeModal}
      />

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/busqueda" element={<Busqueda />} />

        <Route
          path="/catalogo"
          element={<Catalogo agregarASolicitudes={agregarASolicitudes} />}
        />

        <Route
          path="/recomendaciones"
          element={<Recomendaciones agregarASolicitudes={agregarASolicitudes} />}
        />

        <Route
          path="/resenas"
          element={<Resenas agregarASolicitudes={agregarASolicitudes} />}
        />

        <Route
          path="/resenas/:libroId"
          element={<Resenas agregarASolicitudes={agregarASolicitudes} />}
        />

        <Route path="/contacto" element={<Contacto />} />

        <Route
          path="/admin"
          element={
            <RutaProtegida isAdminRoute={true}>
              <AdminPanel />
            </RutaProtegida>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer />
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
