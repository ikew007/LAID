import express, { Request, Response } from 'express';

import { create } from './handlers/verifications/create.handler';
import { revert } from './handlers/verifications/revert.handler';
import { confirm } from './handlers/verifications/confirm.handler';
import { authUser, getUserName } from './utils/jwt.validate';
import { getAvailable } from "./handlers/verifications/getAvailable.handler";
import { getRequested } from './handlers/verifications/getRequested.handler';
import { getIncoming } from './handlers/verifications/getIncoming.handler';
import { getConfirmed } from './handlers/verifications/getConfirmed.handler';

const router = express.Router();

router.post("/create", async (req: Request, res: Response) => {
    try {
        const isAuthed = authUser(req, res);

        if (!isAuthed) {
            return;
        }

        const model = req.body;
        const verifierLogin = model.verifierLogin;
        const requesterLogin = getUserName(req);
        const result = await create(requesterLogin, verifierLogin);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting available requests" });
    }
});

router.post("/revert", async (req: Request, res: Response) => {
    try {
        const isAuthed = authUser(req, res);

        if (!isAuthed) {
            return;
        }

        const model = req.body;
        const verifierLogin = model.verifierLogin;
        const requesterLogin = getUserName(req);
        const result = await revert(requesterLogin, verifierLogin);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting available requests" });
    }
});

router.post("/confirm", async (req: Request, res: Response) => {
    try {
        const isAuthed = authUser(req, res);

        if (!isAuthed) {
            return;
        }

        const model = req.body;
        const requesterLogin = model.requesterLogin;
        const verifierLogin = getUserName(req);
        const result = await confirm(requesterLogin, verifierLogin);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting available requests" });
    }
});

router.post("/reject", async (req: Request, res: Response) => {
    try {
        const isAuthed = authUser(req, res);

        if (!isAuthed) {
            return;
        }

        const model = req.body;
        const requesterLogin = model.requesterLogin;
        const verifierLogin = getUserName(req);
        const result = await confirm(requesterLogin, verifierLogin);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting available requests" });
    }
});

router.post("/getAvailable", async (req: Request, res: Response) => {
    try {
        const isAuthed = authUser(req, res);

        if (!isAuthed) {
            return;
        }

        const userName = getUserName(req);
        const result = await getAvailable(userName);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting available requests" });
    }
});

router.post("/getRequested", async (req: Request, res: Response) => {
    try {
        const isAuthed = authUser(req, res);

        if (!isAuthed) {
            return;
        }

        const userName = getUserName(req);
        const result = await getRequested(userName);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting created requests" });
    }
});

router.post("/getIncoming", async (req: Request, res: Response) => {
    try {
        const isAuthed = authUser(req, res);

        if (!isAuthed) {
            return;
        }

        const userName = getUserName(req);
        const result = await getIncoming(userName);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting incoming requests" });
    }
});

router.post("/getConfirmed", async (req: Request, res: Response) => {
    try {
        const isAuthed = authUser(req, res);

        if (!isAuthed) {
            return;
        }

        const userName = getUserName(req);
        const result = await getConfirmed(userName);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting incoming requests" });
    }
});

export default router;
