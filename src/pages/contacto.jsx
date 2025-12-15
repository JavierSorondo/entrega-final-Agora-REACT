import { useState } from 'react';
import '../styles/contacto.css';

const API_CONTACTOS_URL = "https://68ebb9b076b3362414ce7c05.mockapi.io/Contactos";

function Contacto() {
  const [nombre, setNombre] = useState(''); 
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [estadoEnvio, setEstadoEnvio] = useState('');

  const manejarEnvio = async (e) => { 
    e.preventDefault(); 
    setEstadoEnvio('enviando');

    const datosContacto = {
      nombre: nombre,
      email: correo,
      mensaje: mensaje,
  };

  try {
    const response = await fetch(API_CONTACTOS_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json',},
      body: JSON.stringify(datosContacto),
    });

    if (!response.ok) {
      throw new Error(`Error al enviar: ${response.statusText}`);
    }
    setEstadoEnvio('exito'); 
    setNombre('');
    setCorreo('');
    setMensaje('');

  } catch (error) {
    console.error('Error al enviar el formulario:', error);
    setEstadoEnvio('error');
  }
};


return (
  <div id="tarjeta">
    <h5>¿Tiene alguna pregunta o recomendación?</h5>
    <h2>Contáctenos</h2>
    <form onSubmit={manejarEnvio}>
      <div>
        <label>Nombre:</label>
        <input
          type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Escriba su nombre."
            required
        />
      </div>
      <div>
                    <label>E-mail:</label>
                    <input
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        placeholder="Escriba su correo electrónico."
                        required
                    />
                </div>

                <div>
                    <label>Mensaje:</label>
                    <textarea 
                        rows="4" 
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)} 
                        placeholder="Escriba aquí su mensaje."
                        required
                    />
                </div>
                
                {/* Mostrar el feedback del estado de envío */}
                {estadoEnvio === 'enviando' && <p className="feedback enviando">Enviando mensaje...</p>}
                {estadoEnvio === 'exito' && <p className="feedback exito">✅ ¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.</p>}
                {estadoEnvio === 'error' && <p className="feedback error">❌ Hubo un error al enviar el mensaje. Por favor, inténtelo de nuevo.</p>}

                <hr /> 
                
                <button type="submit" disabled={estadoEnvio === 'enviando'}>
                    {estadoEnvio === 'enviando' ? 'Enviando...' : 'Enviar'}
                </button>
            </form>
        </div>
    );
}

export default Contacto;