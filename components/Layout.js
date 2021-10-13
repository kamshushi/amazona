import React from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
// MUI
import {
  AppBar,
  Container,
  Link,
  Toolbar,
  Typography,
} from '@material-ui/core';
import useStyles from '../utils/styles';

const Layout = ({ children }) => {
  const classes = useStyles();
  return (
    <div>
      {/* head element */}
      <Head>
        <title>Amazona</title>
      </Head>
      {/* Navbar */}
      <AppBar className={classes.navbar} position="static">
        <Toolbar>
          <NextLink href="/" passHref>
            <Link>
              <Typography className={classes.brand}>Amazona</Typography>
            </Link>
          </NextLink>
          <div className={classes.grow}></div>
          <div>
            <NextLink href="/cart" pasHref>
              <Link>Cart</Link>
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
    </div>
  );
};

export default Layout;
