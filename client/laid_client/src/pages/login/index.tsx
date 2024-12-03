import { Box } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import LoginForm from '../../components/LoginForm/LoginForm';

const useStyles = makeStyles()(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh'
  },
}));

function Index() {
  const { classes } = useStyles();

  return (
    <Box className={classes.root}>
      <LoginForm />
    </Box>
  );
}

export default Index;