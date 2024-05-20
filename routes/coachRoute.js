import  express  from 'express';
import { authenticateToken } from "../middleware/authentication.js";
import { create, deleteCoach, editCoach, showCoach, showCoachs } from '../controllers/coachController.js';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
          if (err) return cb(err)
    
          cb(null, raw.toString('hex') + path.extname(file.originalname))
        })
      }
  });

const upload = multer({ storage: storage })


const router = express.Router();

router.route("/create").post(authenticateToken, upload.single('photo'), create)
router.route("/one").post(showCoach)

router.route("/").get(showCoachs)


router.route("/update").put(authenticateToken, upload.single('photo'), editCoach)
router.route("/delete").delete(authenticateToken,deleteCoach)








export default router;