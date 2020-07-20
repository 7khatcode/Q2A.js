import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '25px',
    paddingBottom: '15px',
  },
  avatar: {
    backgroundColor: 'white',
    width: 70,
    height: 70,
    marginRight: '15px',
  },
}));

export default function CommentItem({ content, user }) {
  const classes = useStyles();
  const { publicName, profileImage } = user;

  return (
    <div style={{ margin: '15px 15px 10px 20px', flex: 1, textAlign: 'right', flexDirection: 'row' }}>
      <Typography color="textPrimary" display="inline" style={{ fontSize: '12px' }}>
        {`${content} - `}
      </Typography>
      <Typography
        display="inline"
        style={{ fontSize: '12px', textDecorationLine: 'underline', cursor: 'pointer', color: '#ff00ee' }}
      >
        {publicName}
      </Typography>
    </div>
  );
}
