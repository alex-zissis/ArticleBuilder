import React, {useEffect, useState} from 'react';
import {MoreVertical} from 'react-feather';
import {format} from 'date-fns';
import {useHistory} from 'react-router-dom';
import {Card} from '~/components/card';
import {CardLayout} from '~/components/card-layout';
import {Page} from '~/components/page';
import {Section} from '~/components/section';
import {Button} from '~/elements';
import {IArticle} from '~/App.types';
import {gql, useQuery} from '@apollo/client';
import './home.scss';

const Home: React.FC = () => {
    const history = useHistory();

    const {loading, error, data} = useQuery<{articles: IArticle[]}>(gql`
        query {
            articles {
                _id
                title
                createdAt
                updatedAt
                publishedAt
                description
            }
        }
    `);

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
                        {data.articles.map(({_id, title, isActive, publishedAt, description, updatedAt}) => (
                            <Card
                                heading={title}
                                meta={{
                                    Author: 'Alex Zissis',
                                    Status: isActive ? 'Active' : 'Draft',
                                    Updated: Boolean(updatedAt) ? format(new Date(Number(updatedAt)), 'dd-MMM-yyyy p') : '-',
                                    Published: Boolean(publishedAt)
                                        ? format(new Date(Number(publishedAt)), 'dd-MMM-yyyy p')
                                        : '-',
                                }}
                                footerSlot={
                                    <>
                                        <Button appearence="secondary" compact>
                                            <MoreVertical size={14} />
                                        </Button>
                                        <Button
                                            appearence="primary"
                                            compact
                                            onClick={() => history.push(`/editor/${_id}`)}>
                                            Edit
                                        </Button>
                                    </>
                                }>
                                {description}
                            </Card>
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
