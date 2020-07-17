import React from 'react';
import { Box, Divider, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { useQuery } from '@apollo/react-hooks';
import Header from './Header';
import Footer from './Footer';
import TagsList from '../TagsList';
import RTL from './RTL';
import News from '../News';
import { ALL_TAGS } from '../../../API/queries';
import { withApollo } from '../../../libs/apollo';
import Expansion from '../Expansion';

const layoutStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  overflowX: 'hidden',
};

const contentStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: '0px 2% 0px 2%',
};

const AskLayout = (props) => {
  const { loading, error, data } = useQuery(ALL_TAGS);
  if (error) {
    console.error(error);
    return <h1>Error</h1>;
  }
  if (loading) return <h1>Loading...</h1>;
  const { tags } = data;
  return (
    <RTL>
      <div className="Layout" style={layoutStyle} dir="rtl">
        <Header />
        <Box className="Content" style={contentStyle}>
          <Grid direction="row" justify={'center'} container spacing={2}>
            <Grid item md={0} xs={12}></Grid>
            <Grid item md={8} xs={12}>
              {props.children}
            </Grid>
            <Grid item md={3} xs={12} style={{ marginTop: '25px' }}>
              <Expansion />
            </Grid>
          </Grid>
        </Box>
        <Footer />
      </div>
    </RTL>
  );
};

export default withApollo({ ssr: true })(AskLayout);