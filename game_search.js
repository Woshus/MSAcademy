import { supabase } from "./database.js";

const searchBar = document.getElementById('search-bar');
const resultsDiv = document.getElementById('search-results');
const searchButton = document.getElementById('game-search-button');

const handleSearch = async () => {
    const query = searchBar.value.trim();
    if (!query) {
        resultsDiv.innerHTML = '';
        return;
    }


    const { data, error } = await supabase
        .from('game_reviews')
        .select('id, title, game_date, game_link, optimized_link, tags, players!inner(name)')
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

    data.forEach(game => {
        const div = document.createElement('div');
        div.classList.add('game-item');
        div.innerHTML = `
      <strong>${game.title}</strong> <br>
      Player: ${game.players.name} <br>
      Date: ${game.game_date} <br>
      <a href="${game.game_link}" target="_blank">View Game</a>
      ${game.optimized_link ? `<br><a href="${game.optimized_link}" target="_blank">Optimized Route</a>` : ''}
      ${game.tags && game.tags.length ? `<br>Tags: ${game.tags.join(', ')}` : ''}
    `;
        resultsDiv.appendChild(div);
    });
};

searchButton.addEventListener('click', handleSearch);






// const handleSearch = async () => {
//     const query = searchBar.value.trim();
//     if (!query) {
//         resultsDiv.innerHTML = '';
//         return;
//     }

//     const { data, error } = await sbase
//         .from('game-reviews')
//         .select(`
//             id,
//             title,
//             game_date,
//             game_link,
//             optimized_link,
//             tags,
//             players!inner(name)
//             `)
//         .ilike('title', `%${query}%`)
//         .order('game_date', { ascending: false });
//     resultsDiv.innerHTML = '';

//     if (error) {
//         resultsDiv.innerHTML = `<p> Error: ${error.message}</p>`;
//     }

//     if (!data || data.length === 0) {
//         resultsDiv.innerHTML = '<p>No results found.</p>';
//         return;
//     }

//     data.forEach(game => {
//         const div = document.createElement('div');
//         div.classList.add('game-item');
//         div.innerHTML = `
//           <strong>${game.title}</strong> <br>
//           Player: ${game.players.name} <br>
//           Date: ${game.game_date} <br>
//           <a href="${game.game_link}" target="_blank">View Game</a>
//           ${game.optimized_link ? `<br><a href="${game.optimized_link}" target="_blank">Optimized Route</a>` : ''}
//           ${game.tags && game.tags.length ? `<br>Tags: ${game.tags.join(', ')}` : ''}
//         `;
//         resultsDiv.appendChild(div);
//     });
// };

// searchBar.addEventListener('input', debounce(handleSearch, 300));







// // Fetch all messages
// async function getMessages() {
//     const { data } = await sbase
//         .from('testing')
//         .select('*')
//         .order('created_at', { ascending: false });
//     return data;
// }

// // Insert a new message
// async function addMessage(content) {
//     await sbase.from('testing').insert([{ content }]);
// }
