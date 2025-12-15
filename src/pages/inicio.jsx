import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/inicio.css'; 
import agoraImg from '../assets/agora-literaria-img.png';

function Inicio() {
  return (
    <main className="inicio-container">
      
      <section className="hero">
        <h2 className="hero-titulo">
          Bienvenido a Ágora Literaria
        </h2>
        <p className="hero-subtitulo">
          El eco digital de las grandes voces del pasado.
        </p>
      </section>

      <section className="mision-section">
        <div className="texto">
          <h3 className="section-titulo">Nuestra Misión: Preservar y Difundir</h3>
          
          <p className="parrafo-uno">
            Ágora Literaria nace de la convicción de que las obras maestras que han forjado nuestra cultura deben ser fácilmente accesibles para todos. Recopilamos y organizamos cuidadosamente un vasto catálogo de libros de dominio público, aquellas joyas literarias cuyos derechos de autor han expirado liberando así su uso y distribución. Esto significa que puedes explorar, leer y descargar estos textos de forma completamente gratuita y legal, asegurando que el legado de grandes autores tan diversos como Cervantes, Dostoievski, Homero o Shakespeare permanezca libre y vivo.
          </p>

          <p className="parrafo-dos">
            Un clásico es un diálogo inagotable que nos conecta con nuestras raíces culturales, un mensaje que trasciende al tiempo. Estas obras son espejos que reflejan la condición humana en toda su profundidad, ofreciéndonos una gran riqueza interpretativa y una profunda comprensión de nosotros mismos y de la vida en sociedad.
          </p>
          
          <p className="parrafo-tres">
            Nuestro objetivo es contribuir activamente en la difusión de este patrimonio. Te invitamos a sumergirte en esta Ágora digital, a redescubrir artistas que ofrecen riquezas intelectuales inagotables, y a ser parte de la gran comunidad que valora y celebra la palabra escrita.
          </p>
        </div>
        
        {/* Espacio para una imagen o ilustración (opcional) */}
        <div className="imagen-placeholder">
          <img src={agoraImg}></img>
          <p>Clásicos sin límites ni barreras.</p>
        </div>
      </section>

      

      <section className="ir-al-catalogo">
        
        <Link to="/catalogo" className='btn-catalogo' >
          Ir al Catálogo de Libros
        </Link>
      
      </section>
          
    </main>
  );
}

export default Inicio;