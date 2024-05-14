import  express  from 'express';
import { authenticateToken } from "../middleware/authentication.js";
import { create, deleteCoach, editCoach, showCoach, showCoachs } from '../controllers/coachController.js';



const router = express.Router();

router.route("/create").post(authenticateToken,create)
router.route("/:id").get(showCoach)

router.route("/").get(showCoachs)


router.route("/:id").put(authenticateToken,editCoach)
router.route("/:id").delete(authenticateToken,deleteCoach)








export default router;