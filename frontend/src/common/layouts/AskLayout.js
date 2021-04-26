import React from 'react';
import { Box } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import Header from './Header/Header';
import Footer from './Footer';
import JssStylesProvider from './JssStylesProvider';
import Expansion from '../components/Expansion';

const styles = {
  layoutStyle: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    overflowX: 'hidden',
  },
  contentStyle: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '2% 0% 1% 0%',
    justifyContent: 'center',
    justifySelf: 'center',
    alignSelf: 'center',
  },
};
const AskLayout = (props) => {
  return (
    <JssStylesProvider>
      <Box sx={styles.layoutStyle}>
        <Header />
        <Box sx={styles.contentStyle}>
          <Grid direction="row" container spacing={2}>
            <Grid item display={{ md: 'none', xs: 'none' }} xs={12}></Grid>
            <Grid item md={8} xs={12}>
              {props.children}
            </Grid>
            <Grid item md={3} xs={12} style={{ marginTop: '25px' }}>
              <Expansion />
            </Grid>
          </Grid>
        </Box>
        <Footer />
      </Box>
    </JssStylesProvider>
  );
};
AskLayout.propTypes = {
  children: PropTypes.object.isRequired,
};

export default AskLayout;