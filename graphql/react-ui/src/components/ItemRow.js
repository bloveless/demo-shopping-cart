import React from 'react';
import {useMutation} from "@apollo/react-hooks";
import {
    createStyles,
    makeStyles,
    TableRow,
    TableCell,
    Button,
} from "@material-ui/core";
import {ADD_ITEM_TO_CART} from "../utils/queries";

const useStyles = makeStyles((theme) =>
    createStyles({
        button: {
            margin: theme.spacing(1),
        },
        input: {
            display: 'none',
        },
    }),
);

const ItemRow = ({item, cart, setCart}) => {
    const classes = useStyles();
    const [addItemToCart, {loading: addItemToCartLoading}] = useMutation(ADD_ITEM_TO_CART);

    const handleAddItemToCart = (itemID) => {
        addItemToCart({
            variables: {
                itemID: itemID,
                cartID: cart.id,
                quantity: 1,
            },
        }).then((result) => {
            if (result && result.data && result.data.addItemToCart) {
                setCart(result.data.addItemToCart);
            }
        })
    };

    return (
        <TableRow>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.price}</TableCell>
            <TableCell>{item.sku}</TableCell>
            <TableCell align="right">
                {cart && (
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={() => handleAddItemToCart(item.id)}
                    >
                        {addItemToCartLoading ? (
                            <span>Adding to Cart</span>
                        ) : (
                            <span>Add To Cart</span>
                        )}
                    </Button>
                )}
            </TableCell>
        </TableRow>
    );
};

export default ItemRow;
