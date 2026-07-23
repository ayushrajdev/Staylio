import { Router } from 'express';
import { pingHandler } from '../../controllers/ping.controller.ts';

const router = Router();

// router.get('/', validate().body(pingSchema).run(), pingHandler);
router.get('/', pingHandler);

export default router;
