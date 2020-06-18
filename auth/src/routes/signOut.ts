import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  req.session = null;
  res.end();
});

export { router as signOutRoute };
