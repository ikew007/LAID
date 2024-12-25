import axios from "axios";
import {BaseModel} from "../models.ts";
import {IncomingVerificationRequestDto, OutgoingVerificationRequestDto, PersonalData, VerifierDto} from "./models.ts";

const getToken = () => localStorage.getItem('accessToken');

const verificationServiceApi = axios.create({
  baseURL: 'http://localhost:5000/verifications',
});

verificationServiceApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const getAvailableVerifiers = async () => {
  try {
    const response = await verificationServiceApi.post('/getAvailable');
    return response.data as BaseModel<string[]>;
  } catch (error) {
    console.error(error);
  }
};

const getRequestedVerifications = async () => {
  try {
    const response = await verificationServiceApi.post('/getRequested');
    return response.data as BaseModel<string[]>;
  } catch (error) {
    console.error(error);
  }
};

const getIncomingVerifications = async () => {
  try {
    const response = await verificationServiceApi.post('/getIncoming');
    return response.data as BaseModel<PersonalData[]>;
  } catch (error) {
    console.error(error);
  }
};

const getConfirmedVerifications = async () => {
  try {
    const response = await verificationServiceApi.post('/getConfirmed');
    return response.data as BaseModel<VerifierDto[]>;
  } catch (error) {
    console.error(error);
  }
};

const createVerificationRequest = async (req: IncomingVerificationRequestDto) => {
  try {
    const response = await verificationServiceApi.post('/create', req);
    return response.data as BaseModel<null>;
  }  catch (error) {
    console.error(error);
  }
};

const revertVerificationRequest = async (req: IncomingVerificationRequestDto) => {
  try {
    const response = await verificationServiceApi.post('/revert', req);
    return response.data as BaseModel<null>;
  } catch (error) {
    console.error(error);
  }
};

const confirmVerificationRequest = async (req: OutgoingVerificationRequestDto) => {
  try {
    const response = await verificationServiceApi.post('/confirm', req);
    return response.data as BaseModel<null>;
  }
  catch (error) {
    console.error(error);
  }
};

const rejectVerificationRequest = async (req: OutgoingVerificationRequestDto) => {
  try {
    const response = await verificationServiceApi.post('/reject', req);
    return response.data as BaseModel<null>;
  } catch (error) {
    console.error(error);
  }
};


const verificationApi = {
  getAvailableVerifiers,
  getRequestedVerifications,
  getIncomingVerifications,
  getConfirmedVerifications,
  createVerificationRequest,
  revertVerificationRequest,
  confirmVerificationRequest,
  rejectVerificationRequest,
};

export default verificationApi;