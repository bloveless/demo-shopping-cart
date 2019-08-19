import ApolloClient from "apollo-boost";

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
});

export const getClient = () => client;
