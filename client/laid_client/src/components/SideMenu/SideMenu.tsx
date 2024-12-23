import {makeStyles} from "tss-react/mui";
import {Button, Drawer, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth.ts";

const useStyles = makeStyles()((theme) => ({
  drawer: {
    width: '250px',
    padding: '20px',
  },
  listItem: {
    width: '100%',
    cursor: 'pointer',
    border: "none",
    padding: '15px',
    "&:hover": {
      backgroundColor: `${theme.palette.primary}`,
    }
  },
  logoutButton: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: '50px',
  },
}));

export default function SideMenu() {
  const {classes} = useStyles();
  const {logout, isAuthenticated} = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={isAuthenticated}
      classes={{
        paper: classes.drawer,
      }}
    >
      <Button
        variant='outlined'
        className={classes.listItem}
        onClick={() => navigate('/profile')}
      >
        <Typography>
          Profile
        </Typography>
      </Button>
      <Button
        variant='outlined'
        className={classes.listItem}
        onClick={() => navigate('/verify')}
      >
        <Typography>
          Verify
        </Typography>
      </Button>
      <Button
        variant='outlined'
        className={classes.logoutButton}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Drawer>
  );
}