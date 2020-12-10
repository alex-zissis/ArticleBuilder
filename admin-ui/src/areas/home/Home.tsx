import React from 'react';
import {MoreVertical} from 'react-feather';
import {format} from 'date-fns';
import {useHistory} from 'react-router-dom';
import {Card} from '~/components/card';
import {CardLayout} from '~/components/card-layout';
import {Page} from '~/components/page';
import {Section} from '~/components/section';
import {Button} from '~/elements';
import {IArticle} from '~/App.Types';
import {gql, useQuery} from '@apollo/client';
import './home.scss';
import {ArticleCard} from '../articles/components/article-card';
import {GQLGetArticles} from '~/queries/articles';

const Home: React.FC = () => {
    const history = useHistory();

    const {loading, error, data} = useQuery<{articles: IArticle[]}>(GQLGetArticles());

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <Page>
            <main className="c-home">
                <h1>Home</h1>
                <Section
                    heading="My Articles"
                    actionSlot={
                        <Button appearence="primary" onClick={() => history.push('/editor')}>
                            New
                        </Button>
                    }>
                    <CardLayout>
                        {data.articles.map((article) => (
                            <ArticleCard key={article._id} article={article} />
                        ))}
                        <Card>
                            <div className="ab-g-flex-center">
                                <Button appearence="secondary">See More</Button>
                            </div>
                        </Card>
                    </CardLayout>
                </Section>
                <Section heading="Users" actionSlot={<Button appearence="primary">New</Button>} />
            </main>
        </Page>
    );
};

export {Home};
