import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Avatar } from '@material-ui/core';

import { getProfileImage } from '../utilities';

const useStyles = (size) =>
  makeStyles((theme) => ({
    avatar: {
      width: size,
      height: size,
      backgroundColor: 'white',
      marginRight: '5px',
      cursor: 'pointer',
    },
  }))();

const ProfileImage = ({ profileImage, size }) => {
  const classes = useStyles(size);
  if (!profileImage) {
    return <Avatar aria-label="recipe" className={classes.avatar} src={'/images/default_profile.jpg'} />;
  }
  return (
    <Avatar aria-label="recipe" className={classes.avatar} src={getProfileImage(profileImage)}>
      <Avatar aria-label="recipe" className={classes.avatar} src={'/images/default_profile.jpg'} />
    </Avatar>
  );
};

ProfileImage.defaultProps = {
  size: 60,
};

export default ProfileImage;