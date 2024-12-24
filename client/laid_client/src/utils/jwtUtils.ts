import jwtDecode, {JwtPayload} from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

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
  const encodeBase64 = (obj: object) => btoa(JSON.stringify(obj));

  const headerEncoded = encodeBase64(header);
  const payloadEncoded = encodeBase64(payload);
  const signature = CryptoJS.HmacSHA256(`${headerEncoded}.${payloadEncoded}`, secret).toString(CryptoJS.enc.Base64);

  return `${headerEncoded}.${payloadEncoded}.${signature}`;
};

export const getUsername = () : string => {
  const token = localStorage.getItem('accessToken');
  const decoded = decodeJwt(token);
  return decoded?.username || '';
};