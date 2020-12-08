import React, {Suspense} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Articles} from './areas/articles';
import './App.scss';

const Editor = React.lazy(() => import('./areas/editor'));
const EditorProvider = React.lazy(() => import('./areas/editor/EditorProvider'));

const App = () => (
    <div className="App">
        <Router>
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
                        <Articles />
                    </Route>
                </Switch>
            </Suspense>
        </Router>
    </div>
);

export {App};
