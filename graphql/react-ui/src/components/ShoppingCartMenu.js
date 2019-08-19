import React, {useState} from 'react';
import {Badge, Button, ListItemIcon, ListItemText, MenuItem} from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import StyledMenu from './StyledMenu';

const ShoppingCartMenu = ({cart}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    let cartQuantity = null;
    if (cart && cart.items) {
        cartQuantity = cart.items.reduce((accumulator, item) => (accumulator + item.quantity), 0);
    }

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    return (
        <React.Fragment>
            {cartQuantity != null && (
                <Button color="inherit" onClick={handleClick}>
                    <Badge badgeContent={cartQuantity} color="secondary">
                        <ShoppingCartIcon/>
                    </Badge>
                </Button>
            )}
            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {cart && cart.items && cart.items.map((cartItem) => (
                    <MenuItem onClick={handleClose} key={cartItem.id}>
                        <ListItemIcon><div>{cartItem.quantity}</div></ListItemIcon>
                        <ListItemText primary={cartItem.item.name}/>
                    </MenuItem>
                ))}
            </StyledMenu>
        </React.Fragment>
    );
};

export default ShoppingCartMenu;
