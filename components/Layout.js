import React, { useContext } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { Store } from '../utils/Store';
// MUI
import {
  AppBar,
  Container,
  Link,
  Toolbar,
  Typography,
  ThemeProvider,
  CssBaseline,
  Switch,
  Badge,
} from '@material-ui/core';
import useStyles from '../utils/styles';
import { createTheme } from '@material-ui/core/styles';
import Cookies from 'js-cookie';

const Layout = ({ title, children, description }) => {
  const classes = useStyles();
  // useContext
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart } = state;
  // MUI Theme
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    },
  });

  // Dark mode switcher
  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };
  return (
    <div>
      {/* head element */}
      <Head>
        <title>{title ? `${title} - Amazona` : 'Amazona'}</title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      {/* Navbar */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar className={classes.navbar} position="static">
          <Toolbar>
            <NextLink href="/" passHref>
              <Link>
                <Typography className={classes.brand}>Amazona</Typography>
              </Link>
            </NextLink>
            <div className={classes.grow}></div>
            <div>
              <Switch
                checked={darkMode}
                onChange={darkModeChangeHandler}
              ></Switch>
              <NextLink href="/cart" pasHref>
                <Link>
                  {cart.cartItems.length > 0 ? (
                    <Badge
                      color="secondary"
                      badgeContent={cart.cartItems.length}
                    >
                      Cart
                    </Badge>
                  ) : (
                    'Cart'
                  )}
                </Link>
              </NextLink>
              <NextLink href="/login" pasHref>
                <Link>Login</Link>
              </NextLink>
            </div>
          </Toolbar>
        </AppBar>
        {/* Content */}
        <Container className={classes.main}>{children}</Container>
        {/* Footer */}
        <footer className={classes.footer}>
          <Typography>All rights reserved. Amazona.</Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
};

export default Layout;
