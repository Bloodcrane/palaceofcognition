import HeaderLayout from "../Layouts/Header"
import BookList from "../Layouts/BookList";

const BookPage = () => {
    const Style = {
        marginTop: "95px"
    };

    return (
    <div>
        <main>
            <header>
                <HeaderLayout showMain={true} showBooks={false} showMovies={true} showArticles={true} />
            </header>
            <h1 style={Style}>წიგნის წრე</h1>

            {/* წიგნები */}
            <BookList/>
        </main>
    </div>
    )
}

export default BookPage