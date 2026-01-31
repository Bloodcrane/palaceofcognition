import React from 'react';
import ArticleList from '../Layouts/ArticleList';

import { Helmet } from 'react-helmet';

const ArticlePage = () => {
    const Style = {
        marginTop: "95px"
    };

    return (
        <div>
            <Helmet>
                <meta name="description" content={"View more articles"} />
                <meta property="og:title" content={"Articles"} />
                <meta property="og:description" content={"View more articles"} />
            </Helmet>
            <h1 style={Style}>რეცენზიები</h1>
            <ArticleList />
        </div>
    );
};

export default ArticlePage;
