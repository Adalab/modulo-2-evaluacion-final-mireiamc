
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
    //Devuelve undefined cuando no encuentra ningun resultado que coincida.
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
    liElement.classList.add('show_card__fav');

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
    const deleteBtnText = document.createTextNode('X');
    deleteBtn.appendChild(deleteBtnText);
    liElement.appendChild(deleteBtn);
    deleteBtn.classList.add('delete-btn');
    deleteBtn.showId = item.show.id; // Para conseguir que el boton tenga el id del item y poder eliminarlo - stackoverflow.com.

    deleteBtn.addEventListener('click', removeFav);
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
  } else {
    const indexOfFav = favsList.indexOf(existingFav);
    favsList.splice(indexOfFav, 1);
  }

  renderFavsList();
  renderSearchList(searchList);
  storeFavs();
  //   event.currentTarget.classList.add('show_card--fav'); lo sustituye esta funcion que he colocado dentro del if jusnto con el renderFavsList y StoreFavs: renderSearchList(searchList);
}

// Funcion para guardar y actualizar el localStorage
function storeFavs() {
  localStorage.setItem('myfavorites', JSON.stringify(favsList));
}

// Eventos

finderBtn.addEventListener('click', handleClick);
resetBtn.addEventListener('click', removeAllFavs);
