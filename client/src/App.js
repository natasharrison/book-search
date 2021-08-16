import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import LoginForm from './components/LoginForm';
import Navbar from './components/Navbar';
import SignupForm from './components/SignupForm';

import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';

const client = new ApolloClient({
    request: operation => {
        const token = localStorage.getItem('id_token');

        operation.setContext({
            headers: {
                authorization: token ? `Bearer ${token}` : ''
            }
        });
    },
    uri: '/graphql', 
    cache: new InMemoryCache()
});

function App() {
    return (
        <ApolloProvider client={client}>
            <Router>
                <div className="flex-column justify-flex-start min-100-vh">
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
