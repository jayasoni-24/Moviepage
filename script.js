async function fetchData() {
    if (!localStorage.getItem("movies")) {
        try {
            const apiKey = '7e1a52615f064f68d5e2186d500c9a4a'; 
            const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`);
            const result = await response.json();

            // Map the result to the format used in your app
            const movies = result.results.map(movie => ({
                title: movie.title,
                image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'default_image_url.jpg',
                rating: movie.vote_average,
                description: movie.overview
            }));

            // Store movies in localStorage
            localStorage.setItem("movies", JSON.stringify(movies));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
}

// Function to display the movies on the main page
function showData() {
    let movies = JSON.parse(localStorage.getItem("movies"));
    const mainPage = document.querySelector(".mainpage");
    mainPage.innerHTML = '';

    movies.forEach((movie, index) => {
        let div = document.createElement("div");
        div.className = "box";
        div.setAttribute("id", index);

        let html = `
            <img src="${movie.image}" alt="${movie.title}">
            <h2>${movie.rating}</h2>
            <h2>${movie.title}</h2>
            <button onclick="addFavorite(${index})">Add to Favorite</button>
            <button onclick="removeFavorite(${index})">Remove from Favorite</button>
            <button class="review-button">Review</button>
        `;
        div.innerHTML = html;
        mainPage.appendChild(div);

        const reviewButton = div.querySelector('.review-button');
        reviewButton.addEventListener("click", () => {
            // Show modal instead of redirecting to another page
            showModal(movie);
        });
    });
}

// Function to filter movies based on search input
async function filterMovies(searchword) {
    try {
        const apiKey = '7e1a52615f064f68d5e2186d500c9a4a'; 
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchword}`);
        const result = await response.json();

        const movies = result.results.map(movie => ({
            title: movie.title,
            image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'default_image_url.jpg',
            rating: movie.vote_average,
            description: movie.overview
        }));

        const mainPage = document.querySelector(".mainpage");
        mainPage.innerHTML = '';

        movies.forEach((movie, index) => {
            let div = document.createElement("div");
            div.className = "box";
            div.setAttribute("id", index);

            let html = `
                <img src="${movie.image}" alt="${movie.title}">
                <h2>${movie.rating}</h2>
                <h2>${movie.title}</h2>
                <button onclick="addFavorite(${index})">Add to Favorite</button>
                <button onclick="removeFavorite(${index})">Remove from Favorite</button>
                <button class="review-button">Review</button>
            `;
            div.innerHTML = html;
            mainPage.appendChild(div);

            const reviewButton = div.querySelector('.review-button');
            reviewButton.addEventListener("click", () => {
                // Show modal instead of redirecting to another page
                showModal(movie);
            });
        });
    } catch (error) {
        console.error("Error fetching search results:", error);
    }
}

// Function to add a movie to favorites
function addFavorite(index) {
    const movies = JSON.parse(localStorage.getItem("movies"));
    let favoriteMovies = JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favoriteMovies.some(movie => movie.title === movies[index].title)) {
        favoriteMovies.push(movies[index]);
        localStorage.setItem("favorites", JSON.stringify(favoriteMovies));
        alert('Movie added to favorites!');
    } else {
        alert('Movie already in favorites!');
    }
}

// Function to remove a movie from favorites
function removeFavorite(index) {
    const movies = JSON.parse(localStorage.getItem("movies"));
    let favoriteMovies = JSON.parse(localStorage.getItem("favorites")) || [];

    favoriteMovies = favoriteMovies.filter(movie => movie.title !== movies[index].title);
    localStorage.setItem("favorites", JSON.stringify(favoriteMovies));
    alert('Movie removed from favorites!');
}

// Function to display favorite movies
function displayFavorites() {
    const favoriteMovies = JSON.parse(localStorage.getItem("favorites")) || [];
    const mainPage = document.querySelector(".mainpage");
    mainPage.innerHTML = '';

    favoriteMovies.forEach((movie, index) => {
        let div = document.createElement("div");
        div.className = "box";
        div.setAttribute("id", `fav-${index}`);

        let html = `
            <img src="${movie.image}" alt="${movie.title}">
            <h2>${movie.rating}</h2>
            <h2>${movie.title}</h2>
            <button onclick="removeFavoriteFromFavorites(${index})">Remove from Favorite</button>
        `;
        div.innerHTML = html;
        mainPage.appendChild(div);
    });
}

// Function to remove a movie from the favorites list on the favorites page
function removeFavoriteFromFavorites(index) {
    let favoriteMovies = JSON.parse(localStorage.getItem("favorites")) || [];
    favoriteMovies.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favoriteMovies));
    displayFavorites();
}

// Event listeners to load data and handle search functionality
window.addEventListener("DOMContentLoaded", () => {
    fetchData().then(() => {
        showData();
    });

    const searchForm = document.querySelector('.search-container form');
    const searchInput = document.querySelector('.search-box');

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const searchword = searchInput.value.trim().toLowerCase();
        filterMovies(searchword);
    });

    const myAccountLink = document.getElementById('myAccountLink');
    myAccountLink.addEventListener('click', displayFavorites);
});

// Function to show modal for movie details
function showModal(movie) {
    document.getElementById("modal-movie-title").textContent = movie.title;
    document.getElementById("modal-movie-image").src = movie.image;
    document.getElementById("modal-movie-rating").textContent = movie.rating;
    document.getElementById("modal-movie-description").textContent = movie.description;

    // Show the modal
    document.getElementById("movieModal").style.display = "block";
}

// Function to close the modal
function closeModal() {
    document.getElementById("movieModal").style.display = "none";
}

// Close the modal when the user clicks on <span> (x)
document.querySelector(".close").addEventListener("click", closeModal);
