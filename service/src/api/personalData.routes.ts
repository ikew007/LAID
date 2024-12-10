import express, { Request, Response } from 'express';

import { get } from "./handlers/personalData/get.handler";
import { set } from './handlers/personalData/set.handler';
import { authUser, getUserName } from './utils/jwt.validate';

const router = express.Router();

router.post("/get", async (req: Request, res: Response) => {
    const isAuthed = authUser(req, res);

    if (!isAuthed) {
        return;
    }

    const model = req.body;
    const result = await get(model);
    res.send(result);
});

router.post("/set", async (req: Request, res: Response) => {
    const isAuthed = authUser(req, res);

    if (!isAuthed) {
        return;
    }

    const username = getUserName(req);
    const model = req.body;
    const result = await set(username, model);
    res.send(result);
});

export default router;
