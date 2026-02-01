import { useState, useEffect } from 'react';
import LatestNewsComponent from "../Components/LatestNews"
import WebAnnoucement from "../Components/WebAnnoucement";
import { databases } from '../appwrite';
import { Query } from 'appwrite';

const VOTES_DATABASE_ID = '697e6e0200022dd882b7';
const ARTICLES_COLLECTION_ID = 'articles';

const HomePage = () => {
    const [latestArticle, setLatestArticle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const response = await databases.listDocuments(
                    VOTES_DATABASE_ID,
                    ARTICLES_COLLECTION_ID,
                    [Query.orderDesc('$createdAt'), Query.limit(1)]
                );
                if (response.documents.length > 0) {
                    setLatestArticle(response.documents[0]);
                }
            } catch (error) {
                console.error("Error fetching latest article:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLatest();
    }, []);

    const Style = {
        marginTop: "95px"
    };

    return (
        <div>
            <main>
                <h1 style={Style}>მთავარი</h1>

                <WebAnnoucement
                    title="საიტის განახლება 3.0"
                    description="1. ანგარიშის შექმნა 2. პროფილის გვერდები 3. მოწონების ფუნქციონალი 4. სტატიების გამოქვეყნება და რედაქტირება 5. მოწონების ისტორია 6. ადმინის გვერდი 7. ფოლოვერების სისტემა"
                    author="ლუკა ბიკაშვილი"
                    imageUrl="https://i.pinimg.com/564x/69/ca/df/69cadf4d87dcfda36966160f7e92ff8d.jpg"
                />

                {!isLoading && latestArticle ? (
                    <LatestNewsComponent
                        imageUrl={latestArticle.imageUrl}
                        title="უახლესი სტატია"
                        description={`${latestArticle.title} - ${latestArticle.author}`}
                        articleId={latestArticle.$id}
                    />
                ) : !isLoading && (
                    <LatestNewsComponent
                        imageUrl="https://upload.wikimedia.org/wikipedia/ka/thumb/2/23/%E1%83%A0%E1%83%90%E1%83%9B%E1%83%93%E1%83%94%E1%83%9C%E1%83%98%E1%83%9B%E1%83%94_%E1%83%98%E1%83%9C%E1%83%A2%E1%83%94%E1%83%A0%E1%83%95%E1%83%98%E1%83%A3_%E1%83%9E%E1%83%98%E1%83%A0%E1%83%90%E1%83%93_%E1%83%A1%E1%83%90%E1%83%99%E1%83%98%E1%83%97%E1%83%AE%E1%83%94%E1%83%91%E1%83%96%E1%83%94.jpg/1200px-%E1%83%A0%E1%83%90%E1%83%9B%E1%83%93%E1%83%94%E1%83%9C%E1%83%98%E1%83%9B%E1%83%94_%E1%83%98%E1%83%9C%E1%83%A2%E1%83%94%E1%83%A0%E1%83%95%E1%83%98%E1%83%A3_%E1%83%9E%E1%83%98%E1%83%A0%E1%83%90%E1%83%93_%E1%83%A1%E1%83%90%E1%83%99%E1%83%98%E1%83%97%E1%83%AE%E1%83%94%E1%83%91%E1%83%96%E1%83%94.jpg"
                        title="უახლესი რეცენზია"
                        description="რამოდენიმე ინტერვიუ პირად საკითხებზე“ - მარიამ კუტალაძე"
                    />
                )}

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