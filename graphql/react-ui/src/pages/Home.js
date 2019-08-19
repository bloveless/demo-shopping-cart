import React, {useState} from 'react';
import {
    AppBar,
    Badge,
    Button,
    Container,
    Grid,
    Link,
    Modal,
    Paper,
    Toolbar,
    Typography
} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Items from '../components/Items';
import Users from '../components/Users';
import {useHomeStyles} from '../utils/styles';
import {getClient} from '../utils/apollo-client';
import {GET_USER_QUERY} from '../utils/queries';
import AccountMenu from '../components/AccountMenu';

const useStyles = makeStyles((theme) =>
    createStyles({
        paper: {
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '50%',
            height: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: theme.palette.background.paper,
            padding: theme.spacing(2, 4, 4),
            borderRadius: 2,
            outline: 0,
        },
    }),
);

const Home = () => {
    const [userData, setUserData] = useState(null);
    const [cartData, setCartData] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const classes = useHomeStyles();
    const modalClasses = useStyles();
    const userLoading = false;

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

            localStorage.setItem("userID", user.id);
            setShowLogin(false);
        });
    };

    if (localStorage.getItem("userID")) {
        handleUserLogin(localStorage.getItem("userID"));
    }

    let cartQuantity = null;
    if (cartData && cartData.items) {
        cartQuantity = cartData.items.reduce((accumulator, item) => (accumulator + item.quantity), 0);
    }

    return (
        <React.Fragment>
            <AppBar position="absolute" className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        Shopping Cart
                    </Typography>
                    {cartQuantity != null && (
                        <Button color="inherit">
                            <Badge badgeContent={cartQuantity} color="secondary">
                                <ShoppingCartIcon/>
                            </Badge>
                        </Button>
                    )}
                    <AccountMenu userData={userData} setUserData={setUserData} setCartData={setCartData} setShowLogin={setShowLogin}/>
                </Toolbar>
            </AppBar>
            <main className={classes.content}>
                <div className={classes.appBarSpacer}/>
                <Container maxWidth="lg" className={classes.container}>
                    {!userLoading && !userData && (
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
