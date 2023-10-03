'use strict';

// Variables de elementos HTML

const finderInput = document.querySelector('.js-finder');
const finderBtn = document.querySelector('.js-finder-btn');
const searchListUl = document.querySelector('.js-search-list');
const searchListText = document.querySelector('.js-coincidences_text');
const resetBtn = document.querySelector('.js-reset-btn');
// const logBtn = document.querySelector('.log__btn');
// const numSearchResults = document.querySelector('.js-number-results');

// Variables
let searchList = [];

const savedFavs = JSON.parse(localStorage.getItem('myfavorites'));
let favsList = savedFavs;
if (savedFavs === null) {
  favsList = [];
}
// Tuve que hacer la condicion del null porque si no, me daba el error de que el array (cuando haciamos el renderFavsList) con el que abria la pagina por primera vez, no era iterable.
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
      // Printa en el numero de resultados que nos da data.
      //   numSearchResults.innerHTML = `Tienes ${data.length} resultados`;

      renderSearchList(searchList);
    });

  //   // Tecnica: Evento para clicar encima de los resultados
  //   numSearchResults.addEventListener('click', numberOfResults);
}

// Tecnica: funcion manejadora del evento de arriba para que printe en consola el nombre de las series.
// function numberOfResults() {
//   for (const item of searchList) {
//     console.log(item.show.name);
//   }
// }

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

    // Elemento nuevo para la tecnica

    // const h3Date = document.createElement('h3');
    // const textDateH3 = document.createTextNode(
    //   `Fecha de estreno: ${item.show.premiered}`
    // );
    // h3Date.appendChild(textDateH3);
    // elementContainer.appendChild(h3Date);

    // Entrevista tecnica: poner el idioma, si no hay idioma no poner nada y ademas si es en ingles ponerlo como recomendada.
    // if (item.show.language !== null) {
    //   const h3Lang = document.createElement('h3');
    //   const textLangH3 = document.createTextNode(
    //     `Idioma: ${item.show.language}`
    //   );
    //   h3Lang.appendChild(textLangH3);
    //   elementContainer.appendChild(h3Lang);
    // }

    // if (
    //   item.show.language === 'English' ||
    //   item.show.language === 'Spanish' ||
    //   item.show.language === 'Portuguese'
    // ) {
    //   const recomended = document.createElement('p');
    //   const textRecomended = document.createTextNode(`Serie recomendada`);
    //   recomended.appendChild(textRecomended);
    //   elementContainer.appendChild(recomended);
    // }
    //Busco si hay algun item con un id en favsList que me coincida con aluguno de los id de los items de la busqueda. En el caso de que coincida alguno, lel añado las clases que haran que me cambie de color la letra y el fondo de la tarjeta.
    const existingFav = favsList.find((fav) => item.show.id === fav.show.id);
    //Devuelve undefined cuando no encuentra ningun resultado que coincida.
    if (existingFav !== undefined) {
      elementContainer.classList.add('show_card--fav');
      h3Title.classList.add('show_card--title');
    }

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
    deleteBtn.showId = item.show.id; // Para conseguir que el boton tenga el id del item y poder eliminarlo - stackoverflow.com. No utilizo el id pq no puedo tener el mismo id en dos elementos diferentes del HTML, no puedo tener un boton con 123 y un li con un id 123.

    // logBtn.addEventListener('click', logFavs); //Evento boton log entrevista tecnica
    deleteBtn.addEventListener('click', removeFav);
  }
}
// funcion prueba entrevista tecnica

// function logFavs() {
//   for (const item of favsList) {
//     console.log(`Serie favorita: ${item.show.name}`);
//   }
//   console.log(favsList.length);
// }
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

// Funcion manejadora del evento click para añadir o quitar de favoritos el item clicado.
function clickFavs(event) {
  // Guardo en itemClickedId el id del item que he clicado
  const itemClickedId = event.currentTarget.id;
  // guardo en itemClicked el elemento del array de la lista de busqueda (searchList), que coincida con el id del item clicado. El toString lo necesito pq el id que leo es un string, por lo que el id del array tengo que pasarlo a string. 
  const itemClicked = searchList.find(
    (item) => item.show.id.toString() === itemClickedId
  );
  // Hago una variable y busco con find en el array de favoritos si el id del item clicado coincide con alguno de los que tengo guardado en mi array favsList.
  const existingFav = favsList.find(
    (item) => itemClicked.show.id === item.show.id
  );

  // Si existingFav me devuelve undefined, singifica que no tengo ningun favorito que contenga ese id en mi array, por lo que podremos añadirlo haciendo push. Por lo contrario, si ya existe, le diremos que lo elimine del array de favoritos.
  if (existingFav === undefined) {
    favsList.push(itemClicked);
  } else {
    const indexOfFav = favsList.indexOf(existingFav);
    favsList.splice(indexOfFav, 1);
  }
  // Renderizamos de nuevo las funciones del FavsList, renderSearchList y storeFavs para que procesen de nuevo la informacion con las actualizaciones que se hayan podido hacer y se podamos visualizar el resultado con los cambios correspondientes.
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
