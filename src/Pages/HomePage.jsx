import LatestNewsComponent from "../Components/LatestNews"
import WebAnnoucement from "../Components/WebAnnoucement";

const HomePage = () => {
    const Style = {
        marginTop: "95px"
    };

    return (
        <div>
            <main>

                <h1 style={Style}>მთავარი</h1>

                <WebAnnoucement
                    title="საიტის განახლება"
                    description="თქვენ ახლა შეგიძლიათ ანგარიშის შექმნა და გამოიყენოთ მოწონების ფუნქციონალი."
                />

                <LatestNewsComponent
                    imageUrl="https://upload.wikimedia.org/wikipedia/ka/thumb/2/23/%E1%83%A0%E1%83%90%E1%83%9B%E1%83%93%E1%83%94%E1%83%9C%E1%83%98%E1%83%9B%E1%83%94_%E1%83%98%E1%83%9C%E1%83%A2%E1%83%94%E1%83%A0%E1%83%95%E1%83%98%E1%83%A3_%E1%83%9E%E1%83%98%E1%83%A0%E1%83%90%E1%83%93_%E1%83%A1%E1%83%90%E1%83%99%E1%83%98%E1%83%97%E1%83%AE%E1%83%94%E1%83%91%E1%83%96%E1%83%94.jpg/1200px-%E1%83%A0%E1%83%90%E1%83%9B%E1%83%93%E1%83%94%E1%83%9C%E1%83%98%E1%83%9B%E1%83%94_%E1%83%98%E1%83%9C%E1%83%A2%E1%83%94%E1%83%A0%E1%83%95%E1%83%98%E1%83%A3_%E1%83%9E%E1%83%98%E1%83%A0%E1%83%90%E1%83%93_%E1%83%A1%E1%83%90%E1%83%99%E1%83%98%E1%83%97%E1%83%AE%E1%83%94%E1%83%91%E1%83%96%E1%83%94.jpg"
                    title="უახლესი რეცენზია"
                    description="რამოდენიმე ინტერვიუ პირად საკითხებზე“ - მარიამ კუტალაძე"
                />

                <LatestNewsComponent
                    imageUrl="https://i.pinimg.com/564x/69/ca/df/69cadf4d87dcfda36966160f7e92ff8d.jpg"
                    title="უახლესი ფილმი"
                    description="No data available"
                />

                <LatestNewsComponent
                    imageUrl="https://i.pinimg.com/564x/a5/d8/92/a5d892f2a1b8f1e2e4fe4293676e4872.jpg"
                    title="უახლესი წიგნი"
                    description="No data available"
                />
            </main>
        </div>
    )
}

export default HomePage