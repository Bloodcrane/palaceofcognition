import BookList from "../Layouts/BookList";

const BookPage = () => {
    const Style = {
        marginTop: "95px"
    };

    return (
        <div>
            <main>
                <h1 style={Style}>წიგნის წრე</h1>

                {/* წიგნები */}
                <BookList />
            </main>
        </div>
    )
}

export default BookPage