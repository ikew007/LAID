import { useState, useEffect } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { profileApi } from "../../../api/profile";
import { getUsername } from "../../../utils/jwtUtils.ts";

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
    justifyContent: 'space-between',
  },
}));

const messageType = {
  success: 'success',
  error: 'error',
}

export default function Profile() {
  const { classes } = useStyles();

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    gender: '',
    citizenship: '',
    placeOfBirth: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' or 'error'

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const username = getUsername();
        const response = await profileApi.getProfile({ username });
        if (response?.isSuccess) {
          setProfileData(response.data.personalData);
          setMessage({ text: '', type: '' });
        } else {
          setMessage({ text: 'Failed to fetch profile', type: messageType.error });
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        setMessage({ text: 'An error occurred while fetching profile data', type: messageType.error });
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: { target: { name: string; value: string; }; }) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setMessage({ text: '', type: '' });
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setMessage({ text: '', type: '' });
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    try {
      const response = await profileApi.setProfile({ personalData: profileData });
      if (response?.isSuccess) {
        setProfileData(response.data.personalData);
        setIsEditing(false);
        setMessage({ text: 'Profile saved successfully!', type: messageType.success });
      } else {
        setMessage({ text: 'Failed to save profile', type: messageType.error });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      setMessage({ text: 'An error occurred while saving profile data', type: messageType.error });
    }
  };

  return (
    <Box className={classes.root}>
      <Button
        variant="outlined"
        style={{ border: "none", fontSize: '20px' }}
      >
        Personal Information
      </Button>
      {message.text && (
        <Alert
          severity={message.type === messageType.success ? 'success' : 'error'}
          style={{ marginBottom: '16px' }}
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
          InputProps={{ readOnly: !isEditing }}
          fullWidth
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={profileData.lastName}
          onChange={handleInputChange}
          InputProps={{ readOnly: !isEditing }}
          fullWidth
        />
        <TextField
          label="Middle Name"
          name="middleName"
          value={profileData.middleName}
          onChange={handleInputChange}
          InputProps={{ readOnly: !isEditing }}
          fullWidth
        />
        <TextField
          label="Date of Birth"
          name="dateOfBirth"
          value={profileData.dateOfBirth}
          onChange={handleInputChange}
          InputProps={{ readOnly: !isEditing }}
          fullWidth
        />
        <TextField
          label="Gender"
          name="gender"
          value={profileData.gender}
          onChange={handleInputChange}
          InputProps={{ readOnly: !isEditing }}
          fullWidth
        />
        <TextField
          label="Citizenship"
          name="citizenship"
          value={profileData.citizenship}
          onChange={handleInputChange}
          InputProps={{ readOnly: !isEditing }}
          fullWidth
        />
        <TextField
          label="Place of Birth"
          name="placeOfBirth"
          value={profileData.placeOfBirth}
          onChange={handleInputChange}
          InputProps={{ readOnly: !isEditing }}
          fullWidth
        />
        {isEditing ? (
          <Box className={classes.buttonGroup}>
            <Button variant="contained" color="secondary" onClick={handleCancelClick}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveClick}>
              Save
            </Button>
          </Box>
        ) : (
          <Button variant="contained" onClick={handleEditClick}>
            Edit
          </Button>
        )}
      </form>
    </Box>
  );
}