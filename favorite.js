document.addEventListener("DOMContentLoaded", () => {

  const favoriteList = document.getElementById("favoriteList");

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  function toggleFavorite(book) {

  const index = favorites.findIndex(f => f.id === book.id);

  if (index === -1) {
    favorites.push(book);
  } else {
    favorites.splice(index, 1);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));

  renderFavorites(); // update UI
}

  function renderFavorites() {

    if (favorites.length === 0) {
      favoriteList.innerHTML = "<h2 style='text-align:center;opacity:0.6'>No favorites yet 💔</h2>";
      return;
    }

    favoriteList.innerHTML = favorites.map(book => `
      <div class="card">

        <img src="${book.cover}">

        <div class="card-body">

          <h3>${book.title}</h3>
          <p>${book.author}</p>

          <button class="fav-btn active" onclick="removeFavorite('${book.id}')">
            ❌ Remove
          </button>

        </div>

      </div>
    `).join("");
  }

  window.removeFavorite = function(id) {
    favorites = favorites.filter(book => book.id !== id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
  }

  renderFavorites();

});