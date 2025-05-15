import { Router } from 'express';
import middleware from '../../middleware/modules';
import reportController from '../../controller/report/reportController';

const router = Router();

router.put('/report', reportController.newReport);
router.put('/report/fill', reportController.putReport);
router.get('/report', reportController.getReport);
router.post('/report/dinamic-values', reportController.getDinamicValues);

export default router;
