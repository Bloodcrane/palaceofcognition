import MovieList from "../Layouts/MovieList";

const MoviePage = () => {
    const Style = {
        marginTop: "95px"
    };

    return (
        <div>
            <main>
                <h1 style={Style}>კინოკლუბი</h1>

                {/* ფილმები */}
                <MovieList />
            </main>
        </div>
    )
}

export default MoviePage