import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-koa';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { createConnection } from 'typeorm';
import koa from 'koa';
import koaStatic from 'koa-static';
import path from 'path';
import { ArticleResolver } from './resolvers';
import { Article } from './models';

const app = new koa();
const PORT = 4000;

const bootstrap = async () => {
    const schema = await buildSchema({
        resolvers: [ArticleResolver],
        container: Container,
    });

    const connection = await createConnection({
        type: 'mongodb',
        host: 'localhost',
        port: 27017,
        database: 'cms-t',
        entities: [Article],
    });

    const server = new ApolloServer({
        schema,
        playground: true,
    });
    server.applyMiddleware({ app });
    app.use(koaStatic(path.join(__dirname, '../../frontend/dist')))

    app.listen({ port: PORT }, () =>
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
    );
};

bootstrap();
