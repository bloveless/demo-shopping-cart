import React from 'react';
import {ApolloProvider} from '@apollo/react-hooks';
import CssBaseline from '@material-ui/core/CssBaseline';
import {useAppStyles} from './utils/styles';
import {getClient} from './utils/apollo-client';
import Home from './pages/Home';

export default function App() {
    const classes = useAppStyles();

    return (
        <div className={classes.root}>
            <ApolloProvider client={getClient()}>
                <CssBaseline/>
                <Home/>
            </ApolloProvider>
        </div>
    );
}
