import { Router, Response, Request } from 'express';
import { requireAuth, requestValidation } from '@pt-ticket/common';
import orderValidator from '../validators/orderValidator';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  res.send({});
});

router.delete('/:orderId', async (req: Request, res: Response) => {
  res.send({});
});

router.post(
  '/',
  requireAuth,
  orderValidator,
  requestValidation,
  async (req: Request, res: Response) => {
    res.send({});
  }
);

router.get('/:orderId', async (req: Request, res: Response) => {
  res.send({});
});

export { router as orderRoute };
