import {gql} from 'apollo-boost';

const ITEM_QUERY = `
    id,
    name,
    price,
    sku
`;

const CART_QUERY = `
    id,
    items {
        id,
        quantity,
        item {
            ${ITEM_QUERY}
        }
    }
`;

const USER_QUERY = `
    id,
    name,
    carts {
        ${CART_QUERY}
    }
`;

export const GET_USER_QUERY = gql`
    query getUser($userID: ID!) {
        user(id: $userID) {
            id,
            name,
            carts {
                ${CART_QUERY}
            }
        }
    }
`;

export const GET_ALL_ITEMS = gql`
    {
        items {
            ${ITEM_QUERY}
        }
    }
`;

export const CREATE_USER = gql`
    mutation createUser($name: String!) {
        createUser(name: $name) {
            ${USER_QUERY}
        }
    }
`;

export const ADD_ITEM_TO_CART = gql`
    mutation addItem($itemID: String!, $cartID: String!, $quantity: Int!) {
        addItemToCart(
            itemID: $itemID
            cartID: $cartID
            quantity: $quantity
        ) {
            ${CART_QUERY}
        }
    }
`;

export const GET_ALL_USERS = gql`
    {
        users {
            id,
            name,
            carts {
                ${CART_QUERY}
            }
        }
    }
`;
