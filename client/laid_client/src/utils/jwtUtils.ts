import jwtDecode, {JwtPayload} from 'jsonwebtoken';

export const decodeJwt = (token: string | null) => {
  try {
    return jwtDecode.decode(token || '') as JwtPayload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};