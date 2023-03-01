const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: { 'Content-type': 'application/json;charset=utf-8' },
    params: {
        'api_key': API_KEY
    },
})

//Utils

const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url)

        }
    })
})

async function createMovies(movies, container, lazyLoad = false) {

    container.innerHTML = ""
    movies.forEach(movie => {

        const movieContainer = document.createElement("div")
        movieContainer.classList.add("movie-container")
        movieContainer.addEventListener("click", () => {
            location.hash = "#movie=" + movie.id
        })

        const movieImg = document.createElement("img")
        movieImg.classList.add("movie-img")
        movieImg.setAttribute("alt", movie.title)

        movieImg.setAttribute(lazyLoad ? "data-img" : 'src', "https://image.tmdb.org/t/p/w300" + movie.poster_path)
        movieImg.addEventListener('error', () => {
            movieImg.setAttribute('src', 'https://images.unsplash.com/photo-1633078654544-61b3455b9161?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGVycm9yJTIwNDA0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60')
        })
        if (lazyLoad) {
            lazyLoader.observe(movieImg);
        }
        movieContainer.appendChild(movieImg)
        container.appendChild(movieContainer)
    });

}

async function createCategories(categories, container) {

    container.innerHTML = ""
    categories.forEach(category => {

        const categoryContainer = document.createElement("div")
        categoryContainer.classList.add("category-container")

        const categoryTitle = document.createElement("h3")
        categoryTitle.classList.add("category-title")
        categoryTitle.setAttribute("id", "id" + category.id)
        categoryTitle.addEventListener('click', () => location.hash = `#category=${category.id}-${category.name}`)
        categoryTitle.innerHTML = `${category.name}`

        categoryContainer.appendChild(categoryTitle)
        container.appendChild(categoryContainer)
    });
}

async function getTrendingMoviesPreview() {

    const { data } = await api('trending/movie/day')
    const movies = data.results;
    createMovies(movies, trendingMoviesPreviewList, true)

}

async function getCategoriesPreview() {
    const { data } = await api('genre/movie/list')
    const categories = data.genres;
    createCategories(categories, categoriesPreviewList)
}

async function getMoviesByCategory(id) {

    const { data } = await api('/discover/movie', {
        params: {
            with_genres: id,
        }
    })
    const movies = data.results;
    createMovies(movies, genericSection, true)

}

async function getMoviesBySearch(query) {

    const { data } = await api('search/movie', {
        params: {
            query,
        }
    })
    const movies = data.results;
    createMovies(movies, genericSection)

}

async function getTrendingMovies() {

    const { data } = await api('trending/movie/day')
    const movies = data.results;
    createMovies(movies, genericSection)

}
async function getMovieById(id) {
    const { data: movie } = await api('movie/' + id)

    const movieImgUrl = "https://image.tmdb.org/t/p/w500" + movie.poster_path
    headerSection.style.background = `linear-gradient(
180deg, 
rgba(0, 0, 0, 0.35) 19.27%, 
rgba(0, 0, 0, 0) 29.17%
),url(${movieImgUrl})`
    movieDetailTitle.textContent = movie.original_title
    movieDetailDescription.textContent = movie.overview
    movieDetailScore.textContent = movie.vote_average

    createCategories(movie.genres, movieDetailCategoriesList)
    getSimilarMovies(id)

}

async function getSimilarMovies(id) {
    const { data } = await api('movie/' + id + '/similar')
    const movies = data.results;

    createMovies(movies, relatedMoviesContainer)
    relatedMoviesContainer.scrollTo(0, 0)

}
