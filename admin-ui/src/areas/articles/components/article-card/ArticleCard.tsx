import React, {useContext} from 'react';
import {format} from 'date-fns';
import {MoreVertical} from 'react-feather';
import {IArticle} from '~/App.Types';
import {Card} from '~/components/card';
import {Button, Lozenge} from '~/elements';
import {useHistory} from 'react-router-dom';
import {getApolloContext} from '@apollo/client';
import {GQLPublishArticle} from '~/queries/articles';
import './article-card.scss';
import {getTimestampAsDateTimeOrDefault} from '~/App.Utils';

interface ArticleCardProps {
    article: IArticle;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
    article: {_id, isActive, updatedAt, publishedAt, title, description},
}) => {
    const history = useHistory();
    const {client} = useContext(getApolloContext());

    const publishArticle = () => {
        client
            .mutate({
                mutation: GQLPublishArticle,
                variables: {
                    publishArticleData: {
                        _id,
                    },
                },
            })
            .then((res) => console.log(res));
    };

    return (
        <Card
            heading={title}
            meta={{
                Author: 'Alex Zissis',
                Status: isActive ? 'Active' : 'Draft',
                Updated: getTimestampAsDateTimeOrDefault(updatedAt),
                Published: getTimestampAsDateTimeOrDefault(publishedAt),
            }}
            lozengeSlot={!isActive && <Lozenge>Draft</Lozenge>}
            footerSlot={
                <>
                    <Button appearence="secondary" compact>
                        <MoreVertical size={14} />
                    </Button>
                    {!isActive && (
                        <Button appearence="secondary" compact onClick={() => publishArticle()}>
                            Publish
                        </Button>
                    )}
                    <Button appearence="primary" compact onClick={() => history.push(`/editor/${_id}`)}>
                        Edit
                    </Button>
                </>
            }>
            {description}
        </Card>
    );
};

export {ArticleCard};
