import { NextFunction, Request, Response } from "express";
import { verifyJwtToken } from "./jwt.helper";


export function authUser(req: Request, res: Response) {
    const token = req.headers.authorization;
    console.log(token);
    if (token) {
        const isValid = verifyJwtToken(token);
        if (isValid) {
            return true;
        } else {
            res.status(401);
            return false;
        }
    } else {
        res.status(401);
        return false;
    }
}

export function getUserName(req: Request): string {
    const token = req.headers.authorization!;
    const decoded = verifyJwtToken(token);
    return decoded.username;
}