import "reflect-metadata";
import {ApolloServer} from "apollo-server-koa";
import {buildSchema} from "type-graphql";
import {Container} from "typedi";
import {createConnection} from "typeorm";
import koa from "koa";
import mount from "koa-mount";
import serve from "koa-static";
import path from "path";
import {ArticleResolver} from "./resolvers";
import {Article} from "./models";
import {ImageRouter} from "./endpoints";

const app = new koa();

const PORT = 4000;

const bootstrap = async () => {
    const schema = await buildSchema({
        resolvers: [ArticleResolver],
        container: Container,
    });

    const connection = await createConnection({
        type: "mongodb",
        host: "localhost",
        port: 27017,
        database: "cms-t",
        entities: [Article],
        useUnifiedTopology: true,
    }).catch((error) =>
        console.error("Error connecting to mongo. Exiting...", {error})
    );

    if (!connection) {
        throw Error("Could not connect to database");
    }

    const server = new ApolloServer({
        schema,
        playground: true,
    });
    server.applyMiddleware({app});

    // Serve the Admin UI static files
    app.use(serve(path.join(__dirname, "../../admin-ui/dist")));
    // Serve the images in /public (temporary)
    app.use(mount("/public", serve(path.join(__dirname, "../public"))));

    app.use(ImageRouter.routes());
    app.use(ImageRouter.allowedMethods());

    app.listen({port: PORT}, () => {
        console.log(
            `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
        );
        console.log(`Koa Server ready at http://localhost:${PORT}/`);
    });
};

bootstrap().catch((e) => console.error(e));
