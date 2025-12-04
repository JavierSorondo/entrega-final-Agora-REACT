Cambios desde la pre-entrega:

Esta sección resume las modificaciones clave realizadas para integrar la funcionalidad del carrito de descargas (Solicitudes) y asegurar su visibilidad global, alineando la funcionalidad entre `Catálogo.jsx` y `ResenaDetalle.jsx`.

### 1. Centralización del Estado del Carrito (Elevación del Estado)

El estado que controla la lista de solicitudes de descarga (`solicitudes`) y las funciones relacionadas (`agregarASolicitudes`, `openModal`, `closeModal`) se movieron desde `Catalogo.jsx` al componente raíz **`App.jsx`**.

* **`App.jsx`:** Ahora contiene `useState` para `solicitudes` y `isModalOpen`, convirtiendo estas variables y funciones en estado global de la aplicación.
* **`Catalogo.jsx`:** Se eliminó el estado local del carrito.

### 2. Integración de la Funcionalidad de Descarga en Reseñas

Se estableció la propagación de funciones (Drilling Props) para que el botón de la reseña funcione igual que el del catálogo.

* **`App.jsx`:** La función `agregarASolicitudes` se pasó como *prop* a las rutas que utilizan `Reseñas.jsx`.
* **`Reseñas.jsx`:** Se modificó para recibir la *prop* `agregarASolicitudes` y propagarla al componente hijo `<ResenaDetalle />` cuando se renderiza la vista de detalle.
* **`ResenaDetalle.jsx`:** Se modificó el botón **"Descargar Obra Completa"** para llamar a la *prop* `agregarASolicitudes(libro)`, reemplazando la alerta de simulación que existía previamente.

### 3. Visibilidad Global del Modal (`SolicitudesDescarga`)

Para que el modal fuera accesible desde cualquier página (incluyendo `Reseñas`), se movió su renderizado al componente principal.

* **`App.jsx`:** El componente `<SolicitudesDescarga />` se importa y se renderiza **fuera** del componente `<Routes>`, lo que asegura su presencia en el DOM en todas las páginas.
* **`Catalogo.jsx`:** Se eliminó la importación y la renderización del componente `<SolicitudesDescarga />`.

### 4. Movimiento y Alineación del Ícono de Descarga

Se reubicó el botón del carrito para mejorar la consistencia visual y la usabilidad.

* **`Navbar.jsx`:** La definición del componente **`DownloadIcon`** se movió a este archivo. El componente recibe el contador (`solicitudesCount`) y la función para abrir el modal (`onOpenModal`) como *props* desde `App.jsx`.
* **`Catalogo.jsx`:** Se eliminó la renderización del `DownloadIcon`.
* **Alineación CSS:** Se corrigió la estructura del JSX en `Navbar.jsx` para que el ícono fuera un hermano de las etiquetas `<h1>` y `<nav>`, permitiendo que `display: flex` y `align-items: center` de la clase `.navbar-container` lo alinearan correctamente en la misma fila.
* **Estilo del Contador:** Se agregó la clase **`download-count`** al elemento `<span>` dentro de `DownloadIcon` para aplicar los estilos de posicionamiento absoluto (`position: absolute;`, `top: -5px;`) del pequeño contador numérico.

Se creó el componente para mostrar un carrusel o listado de libros elegidos al azar.
Se implementó la función seleccionarAlAzar usando el algoritmo de Fisher-Yates para obtener 5 libros sin repetición de la lista completa.

Se implementó la reutilización del componente BookCard.jsx para presentar las obras recomendadas, manteniendo la consistencia de diseño con el Catálogo.

Se creó el componente principal de búsqueda para gestionar el input y la presentación de resultados.
Se implementó la función agruparResultados para buscar de forma global en los campos Título, Autor y Tema/Género, y agrupar los resultados según la primera coincidencia encontrada.
Se utilizó useState para el término de búsqueda (query) y useMemo para recalcular los resultados eficientemente.
Los resultados se muestran en listas agrupadas por categoría (Título, Autor, Tema) y cada elemento presenta solo Título/Autor con un botón "Ver Reseña" que enlaza a la ruta dinámica (/resenas/:id).

Se implementó la lógica de envío asíncrona (async/await) en manejarEnvio para realizar una petición POST al endpoint Contactos de MockAPI.
Se estructuró el objeto de envío (datosContacto) con los campos nombre, email y mensaje para coincidir con el endpoint de la API.
Se adoptó la validación nativa del navegador (HTML5) para verificar el formato del correo electrónico, aprovechando el atributo type="email" y required en el input.
Se añadió el estado estadoEnvio para proporcionar feedback al usuario (enviando, éxito o error) y se deshabilitó el botón durante el envío para evitar duplicados.
Se reemplazó el campo de Mensaje por una etiqueta <textarea> y se renombró el setter de estado a setMensaje (convención camelCase).

Se implementó la lógica de paginación para mostrar 12 libros por página (4 columnas x 3 filas).
Se añadieron los estados paginaActual y criterioOrdenamiento para controlar la vista del catálogo.
Se creó la función ordenarLibros y se usó useMemo para aplicar el ordenamiento antes de la paginación, optimizando el rendimiento.
Se implementó la funcionalidad de ordenamiento por Título (A-Z), Autor (A-Z) e ID (Recientes) usando un menú <select>.
Se añadieron botones de navegación Anterior y Siguiente, deshabilitando el botón correspondiente en la primera y última página.