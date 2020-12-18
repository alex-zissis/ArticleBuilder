import React, {Suspense} from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import {Home} from "./areas/home";
import "./App.scss";
import {createUploadLink} from "apollo-upload-client";
import {AppProvider} from "./App.Provider";

const Editor = React.lazy(() => import("./areas/editor"));
const EditorProvider = React.lazy(
    () => import("./areas/editor/EditorProvider")
);

const apolloClient = new ApolloClient({
    link: createUploadLink({
        uri: "http://localhost:4000/graphql",
    }),
    cache: new InMemoryCache(),
});

const App = () => (
    <div className="App">
        <Router>
            <AppProvider>
                <ApolloProvider client={apolloClient}>
                    <Suspense fallback={<div>loading...</div>}>
                        <Switch>
                            <Route
                                path="/editor/:articleId?"
                                component={() => (
                                    <EditorProvider>
                                        <Editor />
                                    </EditorProvider>
                                )}
                            />
                            <Route path="/" exact>
                                <Home />
                            </Route>
                        </Switch>
                    </Suspense>
                </ApolloProvider>
            </AppProvider>
        </Router>
    </div>
);

export {App};
