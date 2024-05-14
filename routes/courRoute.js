import  express  from 'express';
import { authenticateToken } from "../middleware/authentication.js";
import { create, deleteCour, editCour, showCour, showCours, reserveCours } from '../controllers/courController.js';



const router = express.Router();

router.route("/create").post(create)

router.route("/book").post(authenticateToken, reserveCours)
router.route("/:id").get(showCour)

router.route("/").get(authenticateToken ,showCours)


router.route("/:id").put(authenticateToken,editCour)
router.route("/:id").delete(authenticateToken,deleteCour)








export default router;