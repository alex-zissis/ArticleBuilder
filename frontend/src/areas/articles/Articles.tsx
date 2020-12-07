import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import {ApiUrl} from '~/App.Constants';

const Articles: React.FC = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        fetch(`${ApiUrl}/api/v1/article`)
            .then((res) => res.json())
            .then((data) => setArticles(data));
    }, []);

    return (
        <div className="c-page">
            <div className="c-articles">
                {articles.map(({_id, title}) => (
                    <Link to={`/editor/${_id}`}><a style={{display: 'block'}}>{title}</a></Link>
                ))}
            </div>
        </div>
    );
};

export {Articles};
