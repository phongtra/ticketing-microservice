import { Router, Response, Request } from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  res.send({});
});

router.delete('/:orderId', async (req: Request, res: Response) => {
  res.send({});
});

router.post('/', async (req: Request, res: Response) => {
  res.send({});
});

router.get('/:orderId', async (req: Request, res: Response) => {
  res.send({});
});

export { router as orderRoute };
