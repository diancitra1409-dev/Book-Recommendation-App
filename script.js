document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const bookList = document.getElementById("bookList");
  const favoriteList = document.getElementById("favoriteList");

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  searchBtn.addEventListener("click", searchBook);

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchBook();
  });

  async function searchBook() {
    const keyword = searchInput.value.trim();

    if (!keyword) {
      bookList.innerHTML = "<h2>Please enter a book title 📚</h2>";
      return;
    }

    bookList.innerHTML = "<h2>Loading books... 📖</h2>";
    searchBtn.disabled = true;

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(keyword)}`
      );

      const data = await response.json();

      if (!data.docs || data.docs.length === 0) {
        bookList.innerHTML = "<h2>No books found 😢</h2>";
        return;
      }

      displayBooks(data.docs);

    } catch (error) {
      console.error(error);
      bookList.innerHTML = "<h2>Error fetching data 😢</h2>";
    } finally {
      searchBtn.disabled = false;
    }
  }

function displayBooks(books) {

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  bookList.innerHTML = "";

  books.slice(0, 12).forEach(book => {

    const id = book.key;
    const title = book.title || "Unknown Title";
    const author = book.author_name ? book.author_name[0] : "Unknown Author";

    const cover = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : "https://via.placeholder.com/150";

    const isFav = favorites.some(f => f.id === id);

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${cover}">
      
      <div class="card-body">
        <h3>${title}</h3>
        <p>${author}</p>

        <button class="fav-btn ${isFav ? "active" : ""}">
          ${isFav ? "❤️ Saved" : "🤍 Favorite"}
        </button>
      </div>
    `;

    // klik detail (opsional)
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("fav-btn")) return;

      window.location.href = `book.html?key=${encodeURIComponent(id)}`;
    });

    // ❤️ FAVORITE BUTTON LOGIC
    const favBtn = card.querySelector(".fav-btn");

    favBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      toggleFavorite({
        id,
        title,
        author,
        cover
      });

      // refresh UI
      displayBooks(books);
    });

    bookList.appendChild(card);
  });
}

function toggleFavorite(book) {

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const index = favorites.findIndex(f => f.id === book.id);

  if (index === -1) {
    favorites.push(book);
  } else {
    favorites.splice(index, 1);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function goToDetail(key) {
  window.location.href = `book.html?key=${encodeURIComponent(key)}`;
}
window.goToDetail = function(key) {
  window.location.href = `book.html?key=${encodeURIComponent(key)}`;
}

  // FAVORITE TOGGLE
  window.toggleFavorite = function(id, title, author, cover) {

    const index = favorites.findIndex(f => f.id === id);

    if (index === -1) {
      favorites.push({ id, title, author, cover });
    } else {
      favorites.splice(index, 1);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));

    searchBook(); // refresh UI
    renderFavorites();
  }

  function renderFavorites() {
    if (!favoriteList) return;

    if (favorites.length === 0) {
      favoriteList.innerHTML = "<p style='text-align:center;opacity:0.6'>No favorites yet 💔</p>";
      return;
    }

    favoriteList.innerHTML = favorites.map(book => `
      <div class="card">
        <img src="${book.cover}">
        <div class="card-body">
          <h3>${book.title}</h3>
          <p>${book.author}</p>
        </div>
      </div>
    `).join("");
  }

  // initial render
  renderFavorites();

});