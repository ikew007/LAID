import express, { Request, Response } from 'express';

import { get } from "./handlers/personalData/get.handler";
import { set } from './handlers/personalData/set.handler';
import { authUser, getUserName } from './utils/jwt.validate';

const router = express.Router();

router.post("/get", async (req: Request, res: Response) => {
    try {
        const isAuthed = authUser(req, res);

        if (!isAuthed) {
            return;
        }

        const username = getUserName(req);
        const result = await get(username);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting personal data" });
    }
});

router.post("/set", async (req: Request, res: Response) => {
    try {
        const isAuthed = authUser(req, res);

        if (!isAuthed) {
            return;
        }
    
        const username = getUserName(req);
        const model = req.body;
        const result = await set(username, model);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error setting personal data" });
    }
});

export default router;
