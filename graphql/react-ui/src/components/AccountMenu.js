import React, {useState} from "react";
import {Button, MenuItem, ListItemIcon, ListItemText} from "@material-ui/core";
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import StyledMenu from "./StyledMenu";

const AccountMenu = ({userData, setUserData, setCartData, setShowLogin}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    if (userData) {
        return (
            <React.Fragment>
                <Button color="inherit" onClick={handleClick}>
                    <PersonIcon/>
                </Button>
                <StyledMenu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem>
                        <ListItemIcon>
                            <PersonIcon/>
                        </ListItemIcon>
                        <ListItemText primary={userData.name}/>
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            localStorage.removeItem("userID");
                            setUserData(null);
                            setCartData(null);
                            handleClose();
                        }}
                    >
                        <ListItemIcon>
                            <ExitToAppIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Log out"/>
                    </MenuItem>
                </StyledMenu>
            </React.Fragment>
        )
    } else {
        return (
            <Button color="inherit" onClick={() => setShowLogin(true)}>
                <PermIdentityIcon/>
            </Button>
        )
    }
};

export default AccountMenu;
