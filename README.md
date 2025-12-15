Cambios desde la pre-entrega:

Se limpió Catalogo.jsx dejando solo las funciones relacionadas a la presentación de los bookCards, la lógica del carrito se subió a app.jsx

Se propagó la función de descarga a reseñas para poder solicitar la descarga desde allí, queda pendiente hacer lo mismo
con el botón editar desde catálogo

Para que el modal fuera accesible desde cualquier página (incluyendo `Reseñas`), se movió su renderizado a app.jsx

Se reubicó el botón del carrito dentro del navbar.

Se incorporaron toasts para pasar info al usuario.

Se creó el componente de búsqueda. Se implementó la función agruparResultados para buscar de forma global en los campos Título, Autor y Tema/Género, y agrupar los resultados según la primera coincidencia encontrada.
Se utilizó useState para el término de búsqueda (query) y useMemo para recalcular los resultados.
Los resultados se muestran en listas agrupadas por categoría (Título, Autor, Tema) y cada elemento presenta solo Título/Autor con un botón "Ver Reseña" que enlaza a /resenas/:id.

Se implementó la lógica de paginación para mostrar 12 libros por página (4 columnas x 3 filas).
Se añadieron los estados paginaActual y criterioOrdenamiento para controlar la vista del catálogo.
Se creó la función ordenarLibros y se usó useMemo para aplicar el ordenamiento antes de la paginación.
Se implementó la funcionalidad de ordenamiento por Título (A-Z), Autor (A-Z) e ID (Recientes) usando un menú.
Se añadieron botones de navegación Anterior y Siguiente, deshabilitando el botón correspondiente en la primera y última página.

Todos los CSS se hicieron pasando los componentes a Gemini y solicitando un estilo adecuado a una página de obras clásicas, en general me agradan pero tienen bastante por mejorar.

El catálogo se hizo dando a Gemini la estructura preparada previamente en MockApi y solicitando el json con los datos completos para obras clásicas sin copyright, tiene mucho por mejorar.

MockApi brinda hasta dos endpoints gratuitos y en este caso necesitabamos tres: usuarios - libros - mensajes.
Esta limitación se resolvió usando un endpoint "Contactos" con todos los campos necesarios tanto para usuarios como para mensajes más un campo booleano "isUser" de modo que tanto usuarios como mensajes se almacenan en la misma tabla y luego se filtran según lo que se solicite. Es una solución de compromiso, no es lo ideal pero a esta escala resultó funcionar muy bien.
