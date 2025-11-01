const API_URL = "http://localhost:3000/api/posts";

const searchBar = document.getElementById("search-bar");
const resultsDiv = document.getElementById("search-results");
const postDiv = document.getElementById("post-content");
const searchButton = document.getElementById("post-search-button");

const handleSearch = async () => {
  resultsDiv.innerHTML = "";
  const query = searchBar.value.trim();
  if (!query) return;
  try {
    const result = await fetch(
      `${API_URL}?where[title][like]=${encodeURIComponent(query)}&depth=2`
    );

    const data = await result.json();

    if (!data.docs || data.docs.length === 0) {
      resultsDiv.innerHTML = "<p> No results found.</p>";
    }

    data.docs.forEach((post) => {
      const card = document.createElement("div");
      card.classList.add("result-card");

      const title = post.title || "Untitled Post";
      const author = post.author || "Anonymous";
      const date = post.createdAt
        ? new Date(post.createdAt).toLocaleDateString()
        : "N/A";
      const thumbnail = post.thumbnail?.url || "/images/no_img_found.png";

      card.innerHTML = `
                <div class="result-thumbnail">
                    <img src="${thumbnail}">
                </div>

                <div class="column_div">
                    <a class="title_link" href="#" target="_blank">${title}</a>
                    <div class="meta-info">
                        <span><strong>Author:</strong> ${author}</span>
                        <span><strong>Date:</strong> ${date}</span>
                    </div>
                    <p>${post.excerpt || "No description available."}</p>
                </div>
            `;

      card.querySelector(".title_link").addEventListener("click", (e) => {
        e.preventDefault();
        showPost(post);
      });

      resultsDiv.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    resultsDiv.innerHTML = `<p>Error: ${error.message}</p>`;
  }
};

function buildContent(blocks) {
  const container = document.createElement("div");
  blocks.forEach((block) => {
    let element;

    switch (block.blockType) {
      case "textBlock":
        element = document.createElement("div");
        element.classList.add("text-block");
        element.innerHTML = block.body || "";
        break;
      case "imageBlock":
        element = document.createElement("img");
        element.src = block.image.url;
        element.alt = block.image.alt || "";
        break;
      case "linkBlock":
        if (!block.url) return;
        element.document.createElement("a");
        element.href = block.url;
        element.textContent = block.label || block.url;
        element.target = "_blank";
        break;
      default:
        console.warn("Unknown block type:", block.blockType);
        return;
    }

    container.appendChild(element);
  });
}
async function showPost(post) {
  resultsDiv.style.display = "none";
  postDiv.style.display = "block";

  postContent = buildContent(post.content);

  postDiv.innerHTML = `
        <button id="back-to-search">Back to Search</button>
        <h2>${post.title}</h2>
        <p><strong>Author:</strong> ${post.author || "Anonymous"}</p>
        <p><strong>Date:</strong> ${new Date(
          post.createdAt
        ).toLocaleDateString()}</p>
        <div class="post-body">${post.body || "No content available."}</div>
    `;

  document.getElementById("back-to-search").addEventListener("click", () => {
    postDiv.style.display = "none";
    resultsDiv.style.display = "block";
  });
}

searchButton.addEventListener("click", handleSearch);
