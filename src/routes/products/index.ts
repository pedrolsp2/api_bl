import { Router } from 'express';
import middleware from '../../middleware/modules';
import productsController from '../../controller/products/productsController';

const router = Router();

router.get('/products', productsController.getProducts);

export default router;
