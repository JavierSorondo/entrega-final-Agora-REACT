
import React from 'react';
import '../styles/footer.css';

function Footer() {
  return (
    <footer className="main-footer">
        <div className="footer-content">
            <p className="footer-info">© {new Date().getFullYear()} Ágora Literaria - Todos los derechos reservados para el diseño, las obras son de dominio público.</p>
            <p className="footer-credits">Desarrollado por: @jmsorondo | Proyecto  - Entrega final TT REACT JS - </p>
        </div>
    </footer>
  );
}

export default Footer;