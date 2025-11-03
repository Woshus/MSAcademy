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
      case "textBlock": {
        element = document.createElement("div");
        element.classList.add("text-block");
        element.innerHTML = block.body || "";
        break;
      }

      case "imageBlock": {
        element = document.createElement("img");
        element.src = block.image.url;
        element.alt = block.image.alt || "";
        break;
      }

      case "linkBlock": {
        if (!block.url) return;
        element = document.createElement("a");
        element.href = block.url;
        element.textContent = block.label || block.url;
        element.target = "_blank";
        break;
      }

      case "headerBlock": {
        element = document.createElement(`${block.level}`);
        element.innerHTML = block.heading;
        break;
      }

      case "imageWithLinks": {
        element = document.createElement("div");
        element.classList.add("image-with-links");
        const img = document.createElement("img");
        img.src = block.image?.url || "/images/no_img_found.png";
        img.alt = block.image?.alt || "";
        element.appendChild(img);
        if (Array.isArray(block.links) && block.links.length > 0) {
          const linkList = document.createElement("div");
          linkList.classList.add("link-list");
          block.links.forEach((link, i) => {
            const anchor = document.createElement("a");
            anchor.classList.add("image-left-link");
            anchor.href = link.url || "#";
            anchor.textContent = link.label || `Link ${i + 1}`;
            anchor.target = link.openInNewTab ? "_blank" : " _self";
            linkList.appendChild(anchor);
          });
          element.appendChild(linkList);
        }
        break;
      }
    
      case "oneImageTextBlock": {
        element = document.createElement("div");
        element.classList.add("one-image-text-box");
        const img = document.createElement("img");
        img.src = block.image?.url || "/images/no_img_found.png";
        img.alt = block.image?.alt || "";
        const text = document.createElement("p");
        text.textContent = block.text || "";

        element.appendChild(img);
        element.appendChild(text);

        break;
      }
      case "twoImageTextBlock": {
        element = document.createElement("div");
        const imagesDiv = document.createElement("div");
        imagesDiv.classList.add("two-image-text-box");
        const img1 = document.createElement("img");
        img1.src = block.image1?.url || "/images/no_img_found.png";
        img1.alt = block.image1?.alt || "";
        const img2 = document.createElement("img");
        img2.src = block.image2?.url || "/images/no_img_found.png";
        img2.alt = block.image2?.alt || "";
        imagesDiv.appendChild(img1)
        imagesDiv.appendChild(img2)
        const text = document.createElement("p");
        text.classList.add("text-box");
        text.textContent = block.text || "";
        element.appendChild(imagesDiv);
        element.appendChild(text);
        break;
      }
        
      default:
        console.warn("Unknown block type:", block.blockType);
        return;
    }

    container.appendChild(element);
  });

  return container;
}
async function showPost(post) {
  resultsDiv.style.display = "none";
  postDiv.style.display = "block";

  postDiv.innerHTML = `
        <button id="back-to-search">Back to Search</button>
        <h2>${post.title}</h2>
        <p><strong>Author:</strong> ${post.author || "Anonymous"}</p>
        <p><strong>Date:</strong> ${new Date(
          post.createdAt
        ).toLocaleDateString()}</p>
        <div class="post-body"></div>
    `;
  const postBody = postDiv.querySelector(".post-body");
  const postContent = buildContent(post.content);
  postBody.appendChild(postContent);

  document.getElementById("back-to-search").addEventListener("click", () => {
    postDiv.style.display = "none";
    resultsDiv.style.display = "block";
  });
}

searchButton.addEventListener("click", handleSearch);
