import { supabase } from "./database.js";

const searchBar = document.getElementById('search-bar');
const resultsDiv = document.getElementById('search-results');
const reviewDiv = document.getElementById('review-content');
const searchButton = document.getElementById('game-search-button');
const boardSizes = { beg: "Beginner", int: "Intermediate", exp: "Expert", cus: "Custom" };


const handleSearch = async () => {
    resultsDiv.innerHTML = '';
    const query = searchBar.value.trim();
    if (!query) {
        return;
    }

    const { data, error } = await supabase
        .from('game_reviews_with_game')
        .select('*')
        .ilike('title', `%${query}%`)
        .order('game_date', { ascending: false });

    if (error) {
        resultsDiv.innerHTML = `<p>Error: ${error.message}<p>`;
        return;
    }

    if (!data || data.length === 0) {
        resultsDiv.innerHTML = '<p>No results found.<p>';
        return;
    }

    const display = (value) => value ?? "N/A";

    const full_size = (size) => {
        switch (size) {
            case "beg":
                return "Beginner";
            case "int":
                return "Intermediate";
            case "exp":
                return "Expert";
            case "cus":
                return "Custom";
        }
    }

    data.forEach(review => {
        const card = document.createElement('div');
        card.classList.add('result-card');

        card.innerHTML = `
            <div class="result-thumbnail">
                <img src="" alt="TODO">
            </div>

            <div class="column_div">
                <a class="title_link" href="#" target="_blank">${review.title}</a>
                
                <div class="row_div">
                    <div class="column1">
                        <span><strong>Board Size:</strong> ${boardSizes[review.size]}</span>
                        <span><strong>Player:</strong> ${review.player_name}</span>
                        <span><strong>Date:</strong> ${review.game_date}</span>
                    </div>
                    <div class="column2">
                        <span><strong>3BV:</strong> ${review.three_bv}</span>
                        <span><strong>Zini:</strong> ${review.zini}</span>
                        <span><strong>Max Eff:</strong> ${review.max_eff}%</span>
                    </div>
                </div>

            <span><strong>Comments:</strong> ${review.comment}</span>

            </div>
        `;

        card.querySelector('.title_link').addEventListener('click', (e) => {
            e.preventDefault();
            showReview(review);
        });

        resultsDiv.appendChild(card);
    });
};

function showReview(review) {
    resultsDiv.style.display = 'none';
    reviewDiv.style.display = 'block';

    reviewDiv.innerHTML = `
        <h2>${review.title}</h2>
        <p><strong>Player:</strong> ${review.player_name}</p>
        <p><strong>Date:</strong> ${review.game_date}</p>
        <p><strong>Board Size:</strong> ${boardSizes[review.size]}</p>
        <p><strong>3BV:</strong> ${review.three_bv}</p>
        <p><strong>Zini:</strong> ${review.zini}</p>
        <p><strong>Max Eff:</strong> ${review.max_eff}%</p>
        <p><strong>Comments:</strong> ${review.comment}</p>
        <hr>
        <div>${review.blog_html ?? "<em>No blog content yet.</em>"}</div>
        <button id="back-to-search">Back to Search</button>
    `;

    reviewDiv.querySelector('#back-to-search').addEventListener('click', () => {
        reviewDiv.style.display = 'none';
        resultsDiv.style.display = 'block';
    });
}



searchButton.addEventListener('click', handleSearch);
