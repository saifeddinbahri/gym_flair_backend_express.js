import  express  from 'express';
import reserveEquipment, {create, deleteEquipment, editEquipment, showEquipment, showEquipments } from "../controllers/equipController.js";
import { authenticateToken } from "../middleware/authentication.js";



const router = express.Router();

router.route("/create").post(authenticateToken, create)
router.route("/:id").get(showEquipment)
router.route('/reserve').post(authenticateToken, reserveEquipment)
router.route("/").get(showEquipments)


router.route("/:id").put(authenticateToken,editEquipment)
router.route("/:id").delete(authenticateToken,deleteEquipment)








export default router;