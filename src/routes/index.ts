import { Application } from 'express';
import middleware from '../middleware/modules';
import products from './products';
import brewing from './brewing';
import step from './step';

const router = (app: Application) => {
  app.use(
    '/boletim_eletronico',
    [middleware.validate, middleware.getUser],
    products,
    brewing,
    step
  );
};
export default router;
