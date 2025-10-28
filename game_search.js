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

function renderReviewBlocks(blocks, container) {
    blocks.forEach((block, index) => {
        const data = block.block_data;
        container.appendChild(document.createElement("hr"))
        switch (data.css_class) {

            case "one-img-step-box":
                const one_step_img_box = document.createElement('div');
                one_step_img_box.classList.add("one-img-step-box");
                one_step_img_box.innerHTML = `
                <img src="${data.images}">
                <p>"${data.text}</p>
                `;
                container.appendChild(one_step_img_box);

            case "two-img-step-box":
                const two_step_img_box = document.createElement('section');
                two_step_img_box.innerHTML = `
                    <h2> Step ${index} </h2>
                    <div class="two-img-step-box">
                        <img src="${data.images[1]}">
                        <img src="${data.images[2]}">
                    </div>

                    <p>${data.text}</p>
                    `
                container.appendChild(two_step_img_box);
            default:
                break;
        }
        console.log(data.css_class);
    });
    return;
}

async function showReview(review) {
    resultsDiv.style.display = 'none';
    reviewDiv.style.display = 'block';

    reviewDiv.innerHTML = `
                    <div class="board-info-box">
                <img src="images/08_19_25_170/board.png">
                <div class="links">
                    <a class="game-link" href="${review.game_link}">Original</a>
                    <a class="game-link" href="${review.optimized_link}">Optimized</a>
                </div>
            </div>
        <button id="back-to-search">Back to Search</button>
                `;

    const { data: blocks, error } = await supabase
        .from('review_blocks')
        .select('*')
        .eq('review_id', review.review_id)
        .order('block_order', { ascending: true });

    if (error) {
        reviewDiv.innerHTML = "<p>Error loading blog content.</p>";
        console.error(error);

    } else if (!blocks || blocks.length === 0) {
        reviewDiv.innerHTML = "<p>No blog content yet.</p>";
    } else {
        renderReviewBlocks(blocks, reviewDiv);
    }

    const back_button = document.createElement("button");
    back_button.id = "back-to-search";
    back_button.textContent = "Back to Search";
    reviewDiv.appendChild(back_button);


    reviewDiv.querySelector('#back-to-search').addEventListener('click', () => {
        reviewDiv.style.display = 'none';
        resultsDiv.style.display = 'block';
    });
}



searchButton.addEventListener('click', handleSearch);
