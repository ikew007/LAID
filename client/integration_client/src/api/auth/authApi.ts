import axios from 'axios';
import {AuthRequest, AuthResponse} from "./models.ts";
import {BaseModel} from "../models.ts";

const authServer = axios.create({
  baseURL: 'http://localhost:5000/auth',
})

const login = async (authModel: AuthRequest) => {
  try {
    const response = await authServer.post('/login', authModel);
    return response.data as BaseModel<AuthResponse>;
  } catch (error) {
    console.error(error);
  }
};

const register = async (authModel: AuthRequest) => {
  try {
    const response = await authServer.post('/register', authModel);
    return response.data as BaseModel<null>;
  } catch (error) {
    console.error(error);
  }
}

const logout = async () => {
  try {
    const response = await authServer.post('/logout');
    return response.data as BaseModel<null>;
  } catch (error) {
    console.error(error);
  }
}

const authApi = {
  login,
  register,
  logout,
}

export default authApi;