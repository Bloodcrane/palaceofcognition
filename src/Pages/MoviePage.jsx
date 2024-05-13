import HeaderLayout from "../Layouts/Header"
import MovieList from "../Layouts/MovieList";

const MoviePage = () => {
    const Style = {
        marginTop: "95px"
    };

    return (
    <div>
        <main>
            <header>
                <HeaderLayout showMain={true} showBooks={true} showMovies={false} showArticles={true} />
            </header>
            <h1 style={Style}>კინოკლუბი</h1>

            {/* ფილმები */}
            <MovieList />
        </main>
    </div>
    )
}

export default MoviePage