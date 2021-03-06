import React, { useState } from 'react';
import { GoogleLogin } from 'react-google-login';
import { Button } from '@material-ui/core';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { loginWithGoogle } from '../../API/utility';
import ErrorMessage from './ErrorMessage';

const styles = {
  root: {
    padding: '5px 10px 5px 10px',
    cursor: 'pointer',
  },
};

const GoogleLoginButton = ({ buttonText }) => {
  const [error, setError] = useState(false);

  const router = useRouter();
  return (
    <div>
      <GoogleLogin
        render={(renderProps) => (
          <div style={{ textAlign: 'center', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              style={{ width: '65%', justifyContent: 'space-between', fontSize: '18px' }}
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              sx={styles.button}
              endIcon={
                <img
                  src={'/images/google.png'}
                  style={{ margin: '5px 0px 5px -12px', height: '25px', textAlign: 'left' }}
                />
              }
            >
              {buttonText}
            </Button>
          </div>
        )}
        clientId={process.env.NEXT_PUBLIC_GOOGLE_ID}
        buttonText="Login"
        onSuccess={async (response) => {
          try {
            setError(false);
            await loginWithGoogle(response.tokenId);
            return router.replace('/');
          } catch (e) {
            setError(e.toString());
          }
        }}
        onFailure={(response) => {
          setError(response.toString());
        }}
        cookiePolicy={'single_host_origin'}
      />
      {error && <ErrorMessage text={error} style={{ textAlign: 'center', marginTop: '12px' }} />}
    </div>
  );
};
GoogleLoginButton.propTypes = {
  buttonText: PropTypes.string.isRequired,
};
export default GoogleLoginButton;
