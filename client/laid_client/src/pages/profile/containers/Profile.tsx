import { useState, useEffect } from 'react';
import {TextField, Button, Box, Alert, Select, MenuItem} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { profileApi } from "../../../api/profile";
import { getUsername } from "../../../utils/jwtUtils.ts";
import { countries } from 'countries-list';
import {DatePicker} from "@mui/x-date-pickers";

const useStyles = makeStyles()(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '90vh',
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
    dateOfBirth: null as Date | null,
    gender: '',
    citizenship: '',
    placeOfBirth: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' or 'error'

  const genders = ['Male', 'Female', 'Other'];
  const citizenships = Object.values(countries).map((country) => (country as any).name);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const username = getUsername();
        const response = await profileApi.getProfile({ username });
        if (response?.isSuccess) {
          setProfileData({
            ...response.data.personalData,
            dateOfBirth: response.data.personalData.dateOfBirth ? new Date(response.data.personalData.dateOfBirth) : null,
          });
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

  const handleDateChange = (newDate: Date | null) => {
    setProfileData((prev) => ({
      ...prev,
      dateOfBirth: newDate,
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
      const response = await profileApi.setProfile({
        personalData: {
          ...profileData,
          dateOfBirth: profileData.dateOfBirth ? profileData.dateOfBirth.toISOString() : '',
        },
      });
      if (response?.isSuccess) {
        setProfileData({
          ...response.data.personalData,
          dateOfBirth: new Date(response.data.personalData.dateOfBirth),
        });
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
          disabled={!isEditing}
          fullWidth
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={profileData.lastName}
          onChange={handleInputChange}
          disabled={!isEditing}
          fullWidth
        />
        <TextField
          label="Middle Name"
          name="middleName"
          value={profileData.middleName}
          onChange={handleInputChange}
          disabled={!isEditing}
          fullWidth
        />
        <DatePicker
          label="Date of Birth"
          value={profileData.dateOfBirth}
          onChange={handleDateChange}
          disabled={!isEditing}
        />
        <Select
          name="gender"
          value={profileData.gender}
          onChange={handleInputChange}
          displayEmpty
          fullWidth
          disabled={!isEditing}
        >
          <MenuItem value="" disabled>
            Select Gender
          </MenuItem>
          {genders.map((gender) => (
            <MenuItem key={gender} value={gender}>
              {gender}
            </MenuItem>
          ))}
        </Select>
        <Select
          name="citizenship"
          value={profileData.citizenship}
          onChange={handleInputChange}
          displayEmpty
          fullWidth
          disabled={!isEditing}
        >
          <MenuItem value="" disabled>
            Select Citizenship
          </MenuItem>
          {citizenships.map((citizen) => (
            <MenuItem key={citizen} value={citizen}>
              {citizen}
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="Place of Birth"
          name="placeOfBirth"
          value={profileData.placeOfBirth}
          onChange={handleInputChange}
          disabled={!isEditing}
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