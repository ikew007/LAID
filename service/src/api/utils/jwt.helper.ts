import { sign } from 'jsonwebtoken';
import { verify } from 'jsonwebtoken';
import jwtDecode from 'jsonwebtoken';
import { JwtTokenModel } from '../../api/models/jwt-token.model';

export function createJwtToken(payload: JwtTokenModel): string {
    return sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h', algorithm: 'HS256' });
}

export function verifyJwtToken(token: string): any {
    return verify(token, process.env.JWT_SECRET!, { algorithms: ['HS256'] });
}