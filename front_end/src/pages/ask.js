import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card } from '@material-ui/core';
import AskLayout from '../common/components/Layout/AskLayout';
import EditQuestion from '../common/components/EditQuestion';

const useStyles = makeStyles(() => ({}));

const Ask = () => {
  const classes = useStyles();
  return (
    <AskLayout>
      <Card className={classes.root}>
        <EditQuestion />
      </Card>
    </AskLayout>
  );
};

export default Ask;
