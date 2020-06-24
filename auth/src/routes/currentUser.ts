import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { currentUser } from '@pt-ticket/common';

const router = express.Router();

router.get('/', currentUser, (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
