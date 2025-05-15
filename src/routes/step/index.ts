import { Router } from 'express';
import middleware from '../../middleware/modules';
import stepController from '../../controller/step/stepController';

const router = Router();

router.get('/step', middleware.getTypeFromSkHeader, stepController.getStep);

export default router;
