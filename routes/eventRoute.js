import  express  from 'express';
import { authenticateToken } from "../middleware/authentication.js";
import { getEvents } from '../controllers/eventController.js';
import { createEvent } from '../controllers/eventController.js';
import { reserveEvent } from '../controllers/eventController.js';

const router = express.Router();

router.route('/').get(authenticateToken, getEvents)
router.route('/create').post(authenticateToken, createEvent)
router.route('/join').post(authenticateToken, reserveEvent)


export default router;