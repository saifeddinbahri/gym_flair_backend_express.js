import  express  from 'express';
import reserveEquipment, {create, deleteEquipment, editEquipment, allShowEquipments, showEquipment, showEquipments } from "../controllers/equipController.js";
import { authenticateToken } from "../middleware/authentication.js";



const router = express.Router();

router.route("/create").post(authenticateToken, create)
router.route('/reserve').post(authenticateToken, reserveEquipment)
router.route("/").get(showEquipments)
router.route("/all/").get(allShowEquipments)

router.route("/:id").put(authenticateToken,editEquipment)
router.route("/:id").delete(authenticateToken,deleteEquipment)



export default router;