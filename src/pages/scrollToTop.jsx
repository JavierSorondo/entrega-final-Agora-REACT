{/* Este componente es para desplazar la pantalla al tope de la página cada vez que se navega a una nueva ruta 
    sin él al llamar a un componente nuevo se renderiza pero mantiene en pantalla al componente desde el que se hizo 
    el llamado*/}
    
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
    // Esta función se ejecuta cada vez que 'pathname' (la URL) cambia
    window.scrollTo(0, 0);
    }, [pathname]);

  return null; // Este componente no renderiza nada visible
}

export default ScrollToTop;