import {useEffect, useState} from 'react';
import {Alert, Box, Button, TextField, Typography} from '@mui/material';
import {makeStyles} from 'tss-react/mui';
import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined';
import {useSearchParams} from "react-router-dom";
import {decodeJwt} from "../../../utils/jwtUtils.ts";

const useStyles = makeStyles()(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    gap: '16px',
  },
  form: {
    width: '100%',
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
  },
}));

const messageType = {
  success: 'success',
  error: 'error',
}

export interface ProfileData {
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: string;
  citizenship: string;
  placeOfBirth: string;
}

export default function OAuthTest() {
  const [searchParams] = useSearchParams();
  const {classes} = useStyles();

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    gender: '',
    citizenship: '',
    placeOfBirth: '',
  } as ProfileData);

  const [message, setMessage] = useState({text: '', type: ''});

  useEffect(() => {
    const token = searchParams.get("token");
    const decodedToken = decodeJwt(token);
    if (decodedToken) {
      setProfileData(decodedToken as ProfileData);
    }
  }, [searchParams]);

  const handleInputChange = (e: { target: { name: string; value: string; }; }) => {
    const {name, value} = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignIn = () => {
    const baseUrl = "http://localhost:5173/oauth";
    const additionalUrl = encodeURIComponent("http://localhost:5100/oauthtest");
    window.location.href = `${baseUrl}?redirect=${additionalUrl}`;
  };

  return (
    <Box className={classes.root}>
      <Button
        variant="outlined"
        color="error"
        style={{border: "none", fontSize: '20px'}}
      >
        Personal Information
      </Button>
      {message.text && (
        <Alert
          severity={message.type === messageType.success ? 'success' : 'error'}
          style={{marginBottom: '16px'}}
        >
          {message.text}
        </Alert>
      )}
      <form className={classes.form}>
        <TextField
          label="First Name"
          name="firstName"
          value={profileData.firstName}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={profileData.lastName}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Middle Name"
          name="middleName"
          value={profileData.middleName}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Date of Birth"
          name="dateOfBirth"
          value={profileData.dateOfBirth}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Gender"
          name="gender"
          value={profileData.gender}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Citizenship"
          name="citizenship"
          value={profileData.citizenship}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Place of Birth"
          name="placeOfBirth"
          value={profileData.placeOfBirth}
          onChange={handleInputChange}
          fullWidth
        />
        <Button variant="contained" onClick={handleSignIn} color="error">
          <Box
            className={classes.buttonGroup}
          >
            <Box>
              <BackupOutlinedIcon />
            </Box>
            <Typography>
              Sign in with LAID
            </Typography>
          </Box>
        </Button>
      </form>
    </Box>
  );
}