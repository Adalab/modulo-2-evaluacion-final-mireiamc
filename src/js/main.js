// Aplicacion web de busqueda de series de TV que nos permite:

//  - Estructura basica HTML y CSS con:
//      1. Un input y un boton buscar. HECHO
//      2. Lado izquierdo, donde apareceran las series favoritas HECHO
//      3. Lado derecho, donde apareceran el listado de la busqueda. HECHO
//      4. SI QUEDA TIEMPO: investigar para printar algunas series random como recomendacion.

//  - Filtrar por palabra en el buscador y aparecen las series que coincidan de la API. HECHO
//  - Pintar las series que coincidan con innerHTML o con DOM. HECHO
//  - Tienen que mostrarse foto de la serie y titulo. OJOOO!!! Y si no hubiese foto, sustituirla por una foto de stock. HECHO
//  - Marcar series como favoritas:
//      1. Al hacer click en la serie, cambia el color de fondo y la fuente. HECHO
//      2. Que aparezca en el apartado de la izquierda de series favoritas. Crear variable tipo array para almacenar series favoritas. HECHO
//      3. Aunque la usuaria haga otra busqueda, debe serguir apareciendo a la izquierda el listado de series favoritas. HECHO
//      3. BONUS: Quitar las series del apartado de favoritos y que ya no se vean con el fondo diferente. Mediante un icono de una X al lado de cada favorito. Se borra de    localStorage y del listado.
//  - Almacenar el listado de favoritos en el localStorage para que al recargarse la pagina, se muestre el listado y no tenga que volver a hacer la peticion.

// Paso a paso
//  - Traer los elementos del intput y el boton del HTML al JS.
//  - Recoger el valor del texto que introduce la usuaria en el campo de busqueda.
//  - Crear el evento del boton buscar.
//  - Hacer la peticion al servidor para que nos devuelva las series que coincidan en nombre con el valor del input que ha introducido la usuaria.
//  - Printar en pantalla todas las series que coincidan con el valor del input.
//  -

'use strict';

// Variables de elementos HTML

const finderInput = document.querySelector('.js-finder');
const finderBtn = document.querySelector('.js-finder-btn');
const searchListUl = document.querySelector('.js-search-list');
const searchListText = document.querySelector('.js-coincidences_text');
const resetBtn = document.querySelector('.js-reset-btn');

// Variables
let searchList = [];

const savedFavs = JSON.parse(localStorage.getItem('myfavorites'));
let favsList = savedFavs;
if (savedFavs === null) {
  favsList = [];
}

renderFavsList();

// Funciones

// Funcion manejadora evento click-buscar y llamada a la funcion para pintar el listado de series.
function handleClick(event) {
  event.preventDefault;
  const userValue = finderInput.value;
  const apiUrl = `//api.tvmaze.com/search/shows?q=${userValue}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      searchList = data;
      if (data.length === 0) {
        searchListText.innerHTML =
          'Uy, parece que no tenemos ninguna coincidencia :(';
      } else {
        searchListText.innerHTML = 'Aquí están tus coincidencias:';
      }
      renderSearchList(searchList);
    });
}

// Funcion para pintar las series filtradas y condicion para sustituir la imagen si no tiene.

function renderSearchList(searchList) {
  searchListUl.innerHTML = '';

  for (const item of searchList) {
    const liElement = document.createElement('li');
    searchListUl.appendChild(liElement);

    const elementContainer = document.createElement('article');
    liElement.appendChild(elementContainer);
    elementContainer.setAttribute('id', item.show.id);
    elementContainer.classList.add('show_card');

    const existingFav = favsList.find((fav) => item.show.id === fav.show.id);
    if (existingFav !== undefined) {
      elementContainer.classList.add('show_card--fav');
    }

    const imgElement = document.createElement('img');
    if (item.show.image === null) {
      imgElement.setAttribute(
        'src',
        'https://via.placeholder.com/210x295/ffffff/666666/?text=TV'
      );
    } else {
      imgElement.setAttribute('src', item.show.image.medium);
    }
    imgElement.setAttribute('alt', 'cartel');
    elementContainer.appendChild(imgElement);

    const h3Title = document.createElement('h3');
    const textTitleH3 = document.createTextNode(item.show.name);
    h3Title.appendChild(textTitleH3);
    elementContainer.appendChild(h3Title);

    elementContainer.addEventListener('click', clickFavs);
  }
}

// Funcion para pintar la lista de favoritos
function renderFavsList() {
  const ulFavs = document.querySelector('.favs_list');
  ulFavs.innerHTML = '';

  for (const item of favsList) {
    const liElement = document.createElement('li');
    liElement.setAttribute('id', item.show.id);
    ulFavs.appendChild(liElement);

    const imgElement = document.createElement('img');
    if (item.show.image === null) {
      imgElement.setAttribute(
        'src',
        'https://via.placeholder.com/210x295/ffffff/666666/?text=TV'
      );
    } else {
      imgElement.setAttribute('src', item.show.image.medium);
    }
    imgElement.setAttribute('alt', 'cartel');
    liElement.appendChild(imgElement);

    const h3Title = document.createElement('h3');
    const textTitleH3 = document.createTextNode(item.show.name);
    h3Title.appendChild(textTitleH3);
    liElement.appendChild(h3Title);

    const deleteBtn = document.createElement('button');
    const deleteBtnText = document.createTextNode('Borrar');
    deleteBtn.appendChild(deleteBtnText);
    liElement.appendChild(deleteBtn);
    deleteBtn.classList.add('delete-btn');
    deleteBtn.showId = item.show.id; // Para conseguir que el boton tenga el id del item y poder eliminarlo - stackoverflow.com.

    deleteBtn.addEventListener('click', removeFav);
    resetBtn.addEventListener('click', removeAllFavs);
  }
}

// Funcion para quitar favoritos con el boton borrar

function removeFav(event) {
  event.preventDefault();
  // 1. Modificar el array de favoritos
  const favId = event.currentTarget.showId;
  //Utilizo la propiedad showId que he creado para poder saber el id del item.

  // 1.1 Saber a cual estoy haciendo click (id)
  const index = favsList.findIndex((item) => favId === item.show.id);

  // 1.2 Eliminar del array de favoritos el item.
  favsList.splice(index, 1);

  // 2. Llamar a la funcion renderFavs
  renderFavsList();

  // 3. Llamar a la funcion renderSearchList
  renderSearchList(searchList);

  storeFavs();
}

// Funcion para eliminar TODOS los favoritos con el boton borrar todo.

function removeAllFavs() {
  favsList = [];
  renderFavsList();
  renderSearchList(searchList);
  storeFavs();
}

// Funcion manejadora del evento click para series favoritas.
function clickFavs(event) {
  const itemClickedId = event.currentTarget.id;
  const itemClicked = searchList.find(
    (item) => item.show.id.toString() === itemClickedId
  );

  const existingFav = favsList.find(
    (item) => itemClicked.show.id === item.show.id
  );
  if (existingFav === undefined) {
    favsList.push(itemClicked);
    renderFavsList();
    renderSearchList(searchList);
    storeFavs();
  }

//   event.currentTarget.classList.add('show_card--fav'); lo sustituye esta funcion que he colocado dentro del if jusnto con el renderFavsList y StoreFavs: renderSearchList(searchList);
}

// Funcion para guardar y actualizar el localStorage
function storeFavs() {
  localStorage.setItem('myfavorites', JSON.stringify(favsList));
}

// Eventos

finderBtn.addEventListener('click', handleClick);
