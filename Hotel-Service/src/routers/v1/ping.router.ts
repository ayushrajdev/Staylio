import { Router } from 'express';
import { pingHandler } from '../../controllers/ping.controller.ts';
import { validate } from '../../utils/validators/index.ts';

const router = Router();

router.get('/', pingHandler);
router.get('/', pingHandler);

export default router;
