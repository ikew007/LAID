import {Alert, Box, Button, Typography} from "@mui/material";
import {makeStyles} from "tss-react/mui";
import {useEffect, useState} from "react";
import verificationApi from "../../../api/verification/verificationApi.ts";
import {PersonalData, VerifierDto} from "../../../api/verification/models.ts";
import {formatDate} from "../../../utils/dateUtils.ts";

const useStyles = makeStyles()((theme) => ({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  row: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  rowItem: {
    width: '100%',
    minWidth: '500px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  itemText: {
    margin: 'auto 0',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  border: {
    border: `1px solid ${theme.palette.grey.A400}`,
    padding: theme.spacing(2),
  },
  borderTop: {
    borderTop: `1px solid ${theme.palette.grey.A400}`,
    padding: theme.spacing(3),
  },
  rounded: {
    borderRadius: '15px',
  },
  primaryText: {
    color: theme.palette.primary.main,
  },
  padding3: {
    padding: theme.spacing(3),
  },
}));

const messageType = {
  success: 'success',
  error: 'error',
}

export default function Verify() {
  const {cx, classes} = useStyles();
  const [message, setMessage] = useState({text: '', type: ''});
  const [confirmedVerifications, setConfirmedVerifications] = useState([] as VerifierDto[] | undefined);
  const [requestedVerifications, setRequestedVerifications] = useState([] as string[] | undefined);
  const [availableVerifiers, setAvailableVerifiers] = useState([] as string[] | undefined);
  const [incomingVerifications, setIncomingVerifications] = useState([] as PersonalData[] | undefined);
  const [infoState, setInfoState] = useState<Record<string, boolean>>({});

  const fetchConfirmedVerifications = async () => {
    try {
      const response = await verificationApi.getConfirmedVerifications();
      setConfirmedVerifications(response?.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage({text: 'Failed to fetch data', type: messageType.error});
    }
  }

  const fetchRequestedVerifications = async () => {
    try {
      const response = await verificationApi.getRequestedVerifications();
      setRequestedVerifications(response?.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage({text: 'Failed to fetch data', type: messageType.error});
    }
  }

  const fetchAvailableVerifiers = async () => {
    try {
      const response = await verificationApi.getAvailableVerifiers();
      setAvailableVerifiers(response?.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage({text: 'Failed to fetch data', type: messageType.error});
    }
  }

  const fetchData = async () => {
    try {
      await fetchConfirmedVerifications();
      await fetchRequestedVerifications();
      await fetchAvailableVerifiers();
      await fetchIncomingVerifications();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      setMessage({text: 'Failed to fetch data', type: messageType.error});
    }
  }

  const fetchIncomingVerifications = async () => {
    try {
      const response = await verificationApi.getIncomingVerifications();
      setIncomingVerifications(response?.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage({text: 'Failed to fetch data', type: messageType.error});
    }
  }

  useEffect(() => {
    fetchData().then();
  }, []);

  const handleRequestVerifier = (verifier: string) => {
    verificationApi.createVerificationRequest({verifierLogin: verifier}).then(async () => {
      setMessage({text: 'Request sent', type: messageType.success});
      await fetchRequestedVerifications();
      await fetchAvailableVerifiers();
    }).catch(() => {
      setMessage({text: 'Failed to send request', type: messageType.error});
    });
  };

  const handleRevertVerification = (verifier: string) => {
    verificationApi.revertVerificationRequest({verifierLogin: verifier}).then(async () => {
      setMessage({text: 'Request reverted', type: messageType.success});
      await fetchRequestedVerifications();
      await fetchAvailableVerifiers();
    }).catch(() => {
      setMessage({text: 'Failed to revert request', type: messageType.error});
    });
  };

  const handleInfoToggle = (username: string) => {
    setInfoState((prev) => ({
      ...prev,
      [username]: !prev[username],
    }));
  };

  const handleRejectRequest = (username: string) => {
    verificationApi.rejectVerificationRequest({requesterLogin: username}).then(async () => {
      setMessage({text: 'Request rejected', type: messageType.success});
      await fetchIncomingVerifications();
    }).catch(() => {
      setMessage({text: 'Failed to reject request', type: messageType.error});
    });
  };

  const handleConfirmRequest = (username: string) => {
    verificationApi.confirmVerificationRequest({requesterLogin: username}).then(async () => {
      setMessage({text: 'Request confirmed', type: messageType.success});
      await fetchIncomingVerifications();
    }).catch(() => {
      setMessage({text: 'Failed to confirm request', type: messageType.error});
    });
  }

  return (
    <Box className={cx(classes.root, classes.column)}>
      {message.text && (
        <Alert
          severity={message.type === messageType.success ? 'success' : 'error'}
          style={{marginBottom: '16px'}}
          onTimeUpdate={() => setMessage({text: '', type: ''})}
        >
          {message.text}
        </Alert>
      )}
      <Box
        className={classes.row}
      >
        <Box
          className={cx(classes.column, classes.border, classes.rounded)}
        >
          <Box className={cx(classes.column, classes.padding3)}>
            <Typography
              className={classes.primaryText}
            >
              Current verifications
            </Typography>
            {confirmedVerifications?.map((verifier) => (
              <Box
                key={verifier.login}
                className={cx(classes.rowItem, classes.border, classes.rounded)}
              >
                <Typography
                  className={cx(classes.itemText)}
                >
                  {verifier.login}
                </Typography>
                <Typography
                  className={classes.itemText}
                >
                  From: {formatDate(parseInt(verifier.confirmationDate))}
                </Typography>
              </Box>
            ))}
            {confirmedVerifications?.length === 0 && (
              <Box
                className={cx(classes.rowItem)}
              >
                <Typography
                  className={classes.itemText}
                >
                  No confirmed verifications ...
                </Typography>
              </Box>
            )}
          </Box>
          <Box className={cx(classes.column, classes.borderTop)}>
            <Typography
              className={cx(classes.primaryText, classes.rowItem)}
            >
              Incoming verifications
            </Typography>
            {requestedVerifications?.map((verifier) => (
              <Box
                key={verifier}
                className={cx(classes.rowItem, classes.border, classes.rounded)}
              >
                <Typography
                  className={cx(classes.itemText)}
                >
                  {verifier}
                </Typography>
                <Button
                  variant='outlined'
                  onClick={() => handleRevertVerification(verifier)}
                >
                  Revert
                </Button>
              </Box>
            ))}
            {requestedVerifications?.length === 0 && (
              <Box
                className={cx(classes.rowItem)}
              >
                <Typography
                  className={classes.itemText}
                >
                  No incoming verifications ...
                </Typography>
              </Box>
            )}
          </Box>
          <Box className={cx(classes.column, classes.borderTop)}>
            <Typography
              className={cx(classes.primaryText, classes.rowItem)}
            >
              Available verifiers
            </Typography>
            {availableVerifiers?.map((verifier) => (
              <Box
                key={verifier}
                className={cx(classes.rowItem, classes.border, classes.rounded)}
              >
                <Box
                  className={classes.itemText}
                >
                  <Typography>
                    {verifier}
                  </Typography>
                </Box>
                <Button
                  variant='outlined'
                  onClick={() => handleRequestVerifier(verifier)}
                >
                  Request
                </Button>
              </Box>
            ))}
            {availableVerifiers?.length === 0 && (
              <Box
                className={cx(classes.rowItem)}
              >
                <Typography
                  className={classes.itemText}
                >
                  No available verifiers ...
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        <Box
          className={cx(classes.column, classes.border, classes.rounded)}
        >
          <Typography
            className={classes.primaryText}
          >
            Incoming verification requests
          </Typography>
          <Box
            className={classes.column}
          >
            {incomingVerifications?.map((personalData) => (
              <>
                <Box
                  key={personalData.username}
                  className={cx(classes.rowItem, classes.border, classes.rounded)}
                >
                  <Typography
                    className={classes.itemText}
                  >
                    {personalData.username}
                  </Typography>

                  <Button
                    variant='outlined'
                    onClick={() => handleInfoToggle(personalData.username)}
                  >
                    {infoState[personalData.username] ? "Suspend" : "Info"}
                  </Button>
                </Box>
                {infoState[personalData.username] && (
                  <Box
                    className={cx(classes.column, classes.border, classes.rounded)}
                  >
                    <Typography
                      className={classes.itemText}
                    >
                      First name: {personalData.firstName}
                    </Typography>
                    <Typography
                      className={classes.itemText}
                    >
                      Last name: {personalData.lastName}
                    </Typography>
                    <Typography
                      className={classes.itemText}
                    >
                      Middle name: {personalData.middleName}
                    </Typography>
                    <Typography
                      className={classes.itemText}
                    >
                      Date of birth: {personalData.dateOfBirth}
                    </Typography>
                    <Typography
                      className={classes.itemText}
                    >
                      Gender: {personalData.gender}
                    </Typography>
                    <Typography
                      className={classes.itemText}
                    >
                      Citizenship: {personalData.citizenship}
                    </Typography>
                    <Typography
                      className={classes.itemText}
                    >
                      Place of birth: {personalData.placeOfBirth}
                    </Typography>
                    <Box
                      className={classes.row}
                    >
                      <Button
                        color='error'
                        onClick={() => handleRejectRequest(personalData.username)}
                      >
                        Reject
                      </Button>
                      <Button
                        color='success'
                        onClick={() => handleConfirmRequest(personalData.username)}
                      >
                        Verify
                      </Button>
                    </Box>
                  </Box>
                )}
              </>
            ))}
            {incomingVerifications?.length === 0 && (
              <Box
                className={cx(classes.rowItem)}
              >
                <Typography
                  className={classes.itemText}
                >
                  No incoming verification requests ...
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}