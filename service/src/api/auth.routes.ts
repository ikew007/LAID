import express, { Request, Response } from 'express';

import { login } from "./handlers/auth/login.handler";
import { register } from './handlers/auth/register.handler';
import { logout } from './handlers/auth/logout.handler';
import { authUser, getUserName } from './utils/jwt.validate';

const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
    try {
        const model = req.body;
        const result = await login(model);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging in" });
    }
});

router.post("/register", async (req: Request, res: Response) => {
    try {
        const model = req.body;
        const result = await register(model);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering" });
    }
});

router.post("/logout", async (req: Request, res: Response) => {
    try {
        const isAuthed = authUser(req, res);

        if (!isAuthed) {
            return;
        }

        const username = getUserName(req);
        await logout(username);
        res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging out" });
    }
});

export default router;
