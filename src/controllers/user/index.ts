import { Request, Response } from "express";
import {getUserFromRequest} from "../utils.js";

export async function getUserInfo(req: Request, res: Response) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) {
            res.status(401).send('Not authenticated');
            return;
        }
        res.send({
            name: user.name,
            email: user.email,
        })
    } catch {
        res.status(401).send('Something wrong happened');
    }
}
