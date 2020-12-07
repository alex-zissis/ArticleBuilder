import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {EditorProvider, Editor} from './areas/editor';
import {Articles} from './areas/articles';
import './App.scss';

const App = () => (
    <div className="App">
        <Router>
            <Switch>
                <Route path="/editor/:articleId?">
                    <EditorProvider>
                        <Editor />
                    </EditorProvider>
                </Route>
                <Route path="/">
                    <Articles />
                </Route>
            </Switch>
        </Router>
    </div>
);

export {App};
