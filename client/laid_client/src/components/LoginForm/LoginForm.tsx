import { TextField, Button, Box } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: '16px',
    width: '100%',
  },
  button: {
    marginTop: '8px',
    width: '100%',
  },
}));

const LoginForm = () => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      <TextField
        label="Enter username"
        variant="outlined"
        required
        className={classes.input}
      />
      <TextField
        label="Enter password"
        type="password"
        variant="outlined"
        required
        className={classes.input}
      />
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
      >
        Login
      </Button>
      <Button
        variant="outlined"
        color="primary"
        className={classes.button}
      >
        Register
      </Button>
    </Box>
  );
};

export default LoginForm;
