import React, {useState} from 'react';
import {
    AppBar,
    Container,
    Grid,
    Link,
    Modal,
    Paper,
    Toolbar,
    Typography
} from '@material-ui/core';
import {useHomeStyles, useModalStyles} from '../utils/styles';
import {getClient} from '../utils/apollo-client';
import {GET_USER_QUERY} from '../utils/queries';
import Items from '../components/Items';
import Users from '../components/Users';
import AccountMenu from '../components/AccountMenu';
import ShoppingCartMenu from "../components/ShoppingCartMenu";

const Home = () => {
    const [userData, setUserData] = useState(null);
    const [cartData, setCartData] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const classes = useHomeStyles();
    const modalClasses = useModalStyles();

    const handleUserLogin = (userID) => {
        getClient().query({
            query: GET_USER_QUERY,
            variables: {
                userID,
            }
        }).then((response) => {
            const {user} = response.data;
            setUserData(user);

            if (user && user.carts && user.carts[0]) {
                setCartData(user.carts[0])
            }

            if (user && user.id) {
                localStorage.setItem("userID", user.id);
            } else {
                localStorage.removeItem("userID");
            }

            setShowLogin(false);
        });
    };

    if (localStorage.getItem("userID")) {
        handleUserLogin(localStorage.getItem("userID"));
    }

    return (
        <React.Fragment>
            <AppBar position="absolute" className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        Shopping Cart
                    </Typography>
                    <ShoppingCartMenu cart={cartData}/>
                    <AccountMenu userData={userData} setUserData={setUserData} setCartData={setCartData} setShowLogin={setShowLogin}/>
                </Toolbar>
            </AppBar>
            <main className={classes.content}>
                <div className={classes.appBarSpacer}/>
                <Container maxWidth="lg" className={classes.container}>
                    {!userData && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Paper className={classes.paper}>
                                    No user logged in.
                                </Paper>
                            </Grid>
                        </Grid>
                    )}
                    <Modal
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        open={showLogin}
                    >
                        <div className={modalClasses.paper}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Users handleUserLogin={handleUserLogin}/>
                                </Grid>
                            </Grid>
                        </div>
                    </Modal>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <Items cart={cartData} setCart={setCartData}/>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
                <Typography variant="body2" color="textSecondary" align="center">
                    {'Copyright © '}
                    <Link color="inherit" href="https://material-ui.com/">
                        Your Website
                    </Link>{' '}
                    {new Date().getFullYear()}
                    {'. Built with '}
                    <Link color="inherit" href="https://material-ui.com/">
                        Material-UI.
                    </Link>
                </Typography>
            </main>
        </React.Fragment>
    )
};

export default Home;
