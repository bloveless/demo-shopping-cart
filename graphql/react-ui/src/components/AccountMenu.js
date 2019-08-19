import React, {useState} from "react";
import {Button, Tooltip, withStyles} from "@material-ui/core";
import PersonIcon from '@material-ui/icons/Person';
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

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
                <Button
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    onClick={handleClick}
                >
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
            <Button
                aria-controls="customized-menu"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                onClick={() => setShowLogin(true)}
            >
                <Tooltip title="Login" aria-label={"login"}>
                    <PermIdentityIcon/>
                </Tooltip>
            </Button>
        )
    }
};

export default AccountMenu;
