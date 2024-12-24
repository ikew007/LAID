import { makeStyles } from "tss-react/mui";
import { Button, Drawer, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.ts";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VerifiedIcon from "@mui/icons-material/Verified";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import LogoutIcon from "@mui/icons-material/Logout";

const useStyles = makeStyles()((theme) => ({
  drawer: {
    width: '250px',
    padding: '20px',
  },
  listItem: {
    width: '100%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'left',
    border: "none",
    padding: '15px',
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  icon: {
    marginRight: theme.spacing(1.5),
  },
  logoutButton: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default function SideMenu() {
  const { classes } = useStyles();
  const { logout, isAuthenticated } = useAuth();
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
        variant="outlined"
        className={classes.listItem}
        onClick={() => navigate('/profile')}
      >
        <AccountCircleIcon className={classes.icon} />
        <Typography>Profile</Typography>
      </Button>
      <Button
        variant="outlined"
        className={classes.listItem}
        onClick={() => navigate('/verify')}
      >
        <VerifiedIcon className={classes.icon} />
        <Typography>Verify</Typography>
      </Button>
      <Button
        variant="outlined"
        className={classes.listItem}
        onClick={() => navigate('/integrations')}
      >
        <IntegrationInstructionsIcon className={classes.icon} />
        <Typography>Integrations</Typography>
      </Button>
      <Button
        variant="outlined"
        className={classes.logoutButton}
        onClick={handleLogout}
      >
        <LogoutIcon className={classes.icon} />
        <Typography>Logout</Typography>
      </Button>
    </Drawer>
  );
}
