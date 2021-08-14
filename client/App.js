import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

import LoginForm from '.src/components/LoginForm';
import Navbar from '.src/components/Navbar';
import SignupForm from './src/components/SignupForm';

import SearchBooks from './src/pages/SearchBooks';
import SavedBooks from './src/pages/SavedBooks';

const client = new ApolloClient({
    request: operation => {
        const token = localStorage.getItem('id_token');

        operation.setContext({
            headers: {
                authorization: token ? `Bearer ${token}` : ''
            }
        });
    },
    uri: '/graphql'
});

function App() {
    return (
        <ApolloProvider client={client}>
            <Router>
                <div className="flex-column justify-flex-start min-100-vh">
                    <Header />
                    <Navbar></Navbar>
                    <div className="container">
                        <Switch>
                            <Route exact path="/" component={SearchBooks} />
                            <Route exact path="/login" component={LoginForm} />
                            <Route exact path="/signup" component={SignupForm} />
                            <Route exact path="/profile/:username?" component={SavedBooks} />
                        </Switch>
                    </div>
                </div>
            </Router>
        </ApolloProvider>
    );
}

export default App;
