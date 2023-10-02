# Buscador de Series

En este proyecto impremento un buscador de series utilizando HTML, SASS y JavaScript. El buscador hace uso de una API para obtener series que coincidan con lo que se escribe en el campo de búsqueda. Además, permite agregar y quitar series de una lista de favoritos.

Aquí tienes el enlace para probarla:

http://beta.adalab.es/modulo-2-evaluacion-final-mireiamc/ 

## Características

- **Tecnologías utilizadas**:
  - HTML
  - SASS (preprocesador de CSS)
  - JavaScript

## Detalles del Código

### Variables

- `finderInput`: Se refiere al campo de entrada de texto utilizado para realizar búsquedas de series.
- `finderBtn`: Es el botón de búsqueda.
- `searchListUl`: Corresponde a la lista donde se mostrarán los resultados de la búsqueda.
- `searchListText`: Es el elemento que muestra el texto de coincidencias.
- `resetBtn`: El botón que permite reiniciar la lista de favoritos.
- `searchList`: Una variable que almacena las series encontradas durante la búsqueda.
- `favsList`: Una lista que contiene las series marcadas como favoritas.

### Funciones Principales

1. `handleClick(event)`: Esta función maneja el evento click en el botón de búsqueda. Obtiene el valor ingresado por el usuario, construye una URL de la API y realiza la petición. Una vez que obtiene los datos, actualiza `searchList` y llama a `renderSearchList` para mostrar los resultados.

2. `renderSearchList(searchList)`: Esta función se encarga de mostrar las series encontradas en la lista de resultados. Para cada serie, crea un elemento `li` que contiene una imagen, el título y un identificador. Además, verifica si la serie ya está marcada como favorita y le añade la clase correspondiente.

3. `renderFavsList()`: Pinta la lista de series favoritas. Itera sobre `favsList` y para cada serie crea un elemento `li` que contiene una imagen, el título, un botón de eliminar y un identificador.

4. `removeFav(event)`: Esta función se activa cuando se hace click en el botón de eliminar una serie de favoritos. Primero, obtiene el identificador de la serie. Luego, busca el índice de esa serie en `favsList` y la elimina. Finalmente, llama a `renderFavsList` y `renderSearchList` para actualizar la visualización.

5. `removeAllFavs()`: Elimina todas las series de la lista de favoritos. Llama a `renderFavsList` y `renderSearchList` para actualizar la visualización.

6. `clickFavs(event)`: Esta función maneja el evento click en las series favoritas. Obtiene el identificador de la serie clickeada y verifica si ya está en la lista de favoritos. Si no está, la agrega; si ya está, la quita.

7. `storeFavs()`: Guarda el estado actual de la lista de favoritos en el `localStorage`.

## Instrucciones de Uso

1. Ingresa el nombre de una serie en el campo de búsqueda y presiona el botón de búsqueda.

2. Se mostrarán las coincidencias en la lista de resultados.

3. Haz clic en una serie para agregarla o quitarla de la lista de favoritos.

4. Puedes eliminar una serie de la lista de favoritos haciendo clic en el botón "X" junto a su imagen.

5. Para eliminar todas las series de la lista de favoritos, presiona el botón "Borrar todo".

## Persistencia de Favoritos

Los favoritos se guardan en el `localStorage` del navegador, lo que significa que se mantendrán incluso después de cerrar y volver a abrir la página.

## Notas

- Si no hay coincidencias en la búsqueda, se mostrará un mensaje indicando que no se encontraron resultados.

- Si una serie no tiene imagen, se mostrará una imagen de relleno.
