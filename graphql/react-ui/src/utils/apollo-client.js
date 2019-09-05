import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
    uri: 'http://localhost:3499/m/graphql-shopping-cart/graphql',
});

export const getClient = () => client;
