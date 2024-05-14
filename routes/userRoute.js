import  express  from 'express';
import { signin, signup, profile, editProfile, editBirth, editEmail, editUsername, 
  editPassword, deleteProfile, editProfileImage } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authentication.js";
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

router.route("/signup").post(upload.single('image'),signup)
router.route("/signin").post(signin)
router.route("/profile").get(authenticateToken, profile)
router.route("/edit-profile-photo").post(authenticateToken, upload.single('image'),editProfileImage)
router.route("/edit-username").post(authenticateToken, editUsername)
router.route("/edit-password").post(authenticateToken, editPassword)
router.route("/edit-birth").post(authenticateToken, editBirth)
router.route("/edit-email").post(authenticateToken, editEmail)
router.route("/:id").delete(authenticateToken,deleteProfile)
//router.route("/all").get(showUsers)






export default router;