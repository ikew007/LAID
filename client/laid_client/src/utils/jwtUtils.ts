import jwtDecode, {JwtPayload, Secret} from 'jsonwebtoken';
// import CryptoJS from 'crypto-js';

export const decodeJwt = (token: string | null) => {
  try {
    return jwtDecode.decode(token || '') as JwtPayload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const encodeJwt = (payload: object, secret: string): string => {
  const header = { alg: "HS256", typ: "JWT" };
  return jwtDecode.sign(payload, secret as Secret, { header });
};

export const getUsername = () : string => {
  const token = localStorage.getItem('accessToken');
  const decoded = decodeJwt(token);
  return decoded?.username || '';
};