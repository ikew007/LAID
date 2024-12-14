import axios from 'axios';
import {BaseModel} from "../models.ts";
import {ProfileDataDto, ProfileDataRequest} from "./models.ts";

const getToken = () => localStorage.getItem('accessToken');

const profileServiceApi = axios.create({
  baseURL: 'http://localhost:5000/personalData',
})

profileServiceApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const getProfile = async (req: ProfileDataRequest) => {
  try {
    const response = await profileServiceApi.post('/get', req);
    return response.data as BaseModel<ProfileDataDto>;
  } catch (error) {
    console.error(error);
  }
};

const setProfile = async (req: ProfileDataDto) => {
  try {
    const response = await profileServiceApi.post('/set', req.personalData);
    return response.data as BaseModel<ProfileDataDto>;
  } catch (error) {
    console.error(error);
  }
};

const profileApi = {
  getProfile,
  setProfile,
}

export default profileApi;