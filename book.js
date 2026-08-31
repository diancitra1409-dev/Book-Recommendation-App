document.addEventListener("DOMContentLoaded", async () => {

  const params = new URLSearchParams(window.location.search);
  const key = params.get("key");

  const detail = document.getElementById("detail");

  if (!key) {
    detail.innerHTML = "<h2>No book selected 😢</h2>";
    return;
  }

  try {
    const response = await fetch(`https://openlibrary.org${key}.json`);
    const data = await response.json();

    const title = data.title || "No Title";
    const description =
      data.description?.value ||
      data.description ||
      "No description available 😢";

    const cover = data.covers
      ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
      : "https://via.placeholder.com/300";

    detail.innerHTML = `
      <div style="max-width:600px;margin:auto;background:#1e293b;padding:20px;border-radius:15px;">

        <img src="${cover}" style="width:200px;border-radius:10px;margin-bottom:20px;">

        <h2>${title}</h2>

        <p style="margin-top:15px;opacity:0.8;text-align:left;">
          ${description}
        </p>

      </div>
    `;

  } catch (error) {
    console.error(error);
    detail.innerHTML = "<h2>Error loading book detail 😢</h2>";
  }

});