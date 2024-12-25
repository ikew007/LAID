import { useState, useEffect } from 'react';
import { Button, Box, Alert, Typography, Switch, FormControlLabel } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import SecurityIcon from '@mui/icons-material/Security';

const useStyles = makeStyles()(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
    overflow: 'hidden',
  },
  form: {
    width: '100%',
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  securityImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
}));

const messageType = {
  success: 'success',
  error: 'error',
};

export default function OAuthSettings() {
  const { classes } = useStyles();

  const [oauthEnabled, setOauthEnabled] = useState(() => {
    const savedState = localStorage.getItem('oauthEnabled');
    return savedState === 'true';
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    localStorage.setItem('oauthEnabled', oauthEnabled.toString());
  }, [oauthEnabled]);

  const handleToggleOauth = () => {
    setOauthEnabled(!oauthEnabled);
    setMessage({
      text: oauthEnabled ? 'OAuth integrations disabled' : 'OAuth integrations enabled',
      type: messageType.success,
    });
  };

  const handleTestPageClick = () => {
    window.open('http://localhost:5100/oauthtest', '_blank');
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <SecurityIcon fontSize="large" color="primary" />
        <Typography variant="h4">OAuth Settings</Typography>
      </Box>

      {message.text && (
        <Alert
          severity={message.type === messageType.success ? 'success' : 'error'}
          style={{ marginBottom: '16px' }}
        >
          {message.text}
        </Alert>
      )}

      <Box className={classes.form}>
        <FormControlLabel
          control={
            <Switch
              checked={oauthEnabled}
              onChange={handleToggleOauth}
              color="primary"
            />
          }
          label="Enable OAuth Integrations"
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleTestPageClick}
        >
          Open OAuth Test Page
        </Button>
      </Box>
    </Box>
  );
}
