import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {ApiUrl} from '~/App.Constants';
import {ArticleBuilderFetch} from '~/App.Utils';
import {Page} from '~/components/page';

const Articles: React.FC = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        ArticleBuilderFetch<object[]>(`${ApiUrl}/api/v1/article`).then((data) => setArticles(data));
    }, []);

    return (
        <Page>
            <div className="c-articles">
                {articles.map(({_id, title}) => (
                    <Link to={`/editor/${_id}`}>
                        <a style={{display: 'block'}}>{title}</a>
                    </Link>
                ))}
            </div>
        </Page>
    );
};

export {Articles};
