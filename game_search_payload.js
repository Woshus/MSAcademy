async function loadPosts() {
  const res = await fetch('http://localhost:3000/api/posts');
  const data = await res.json();

  const container = document.getElementById('blog-container');
  container.innerHTML = data.docs.map(post => `
    <article>
      <h2>${post.title}</h2>
      <div>${post.excerpt}</div>
    </article>
  `).join('');
}

document.addEventListener('DOMContentLoaded', loadPosts);