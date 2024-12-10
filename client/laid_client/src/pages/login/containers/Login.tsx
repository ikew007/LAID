import { makeStyles } from "tss-react/mui";
import {Box, Button, TextField, Typography} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { authApi } from "../../../api/auth";

const useStyles = makeStyles()(() => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: "400px",
    margin: "0 auto",
    padding: "20px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
    backgroundColor: "#fff",
  },
  input: {
    marginBottom: "16px",
    width: "100%",
  },
  button: {
    marginTop: "8px",
    width: "100%",
  },
  message: {
    marginBottom: "16px",
    textAlign: 'center',
  },
  error: {
    color: 'red',
  },
  success: {
    color: 'green',
  }
}));

export default function Login() {
  const { classes } = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!username || !password) {
      setMessage('Please fill in all fields.');
      setMessageType('error');
      return;
    }

    setMessage(null);
    setMessageType(null);
    try {
      if (isRegisterMode) {
        const response = await authApi.register({ username, password });
        if (response && response.isSuccess) {
          setMessage('Registration successful! You can now log in.');
          setMessageType('success');
          setIsRegisterMode(false);
        } else {
          setMessage(response?.message || 'Registration failed. Please try again.');
          setMessageType('error');
        }
      } else {
        const response = await authApi.login({ username, password });
        if (response && response.isSuccess) {
          login(response.data.accessToken);
          navigate('/profile');
        } else {
          setMessage(response?.message || 'Invalid username or password.');
          setMessageType('error');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
      setMessageType('error');
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setMessage(null);
    setMessageType(null);
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.container}>
        <Typography variant="h5" gutterBottom>
          {isRegisterMode ? 'Register' : 'Login'}
        </Typography>

        {message && (
          <Typography
            className={`${classes.message} ${messageType === 'success' ? classes.success : ''} ${messageType === 'error' ? classes.error : ''}`}
          >
            {message}
          </Typography>
        )}

        <TextField
          label="Enter username"
          variant="outlined"
          required
          className={classes.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Enter password"
          type="password"
          variant="outlined"
          required
          className={classes.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handleSubmit}
        >
          {isRegisterMode ? 'Register' : 'Login'}
        </Button>

        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={toggleMode}
        >
          {isRegisterMode ? 'Already have an account? Login' : 'Don’t have an account? Register'}
        </Button>
      </Box>
    </Box>
  );
}