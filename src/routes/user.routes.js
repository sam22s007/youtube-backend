import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { changecurrentpassword, currentuser, getuserchannelprofile, getwatchhistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateaccountdetails, updateuseravatar, updateusercoverimg } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router()
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },{
            name:"coverimg",
            maxCount:1
        }
    ]),
    registerUser
)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refreshtoken").post(refreshAccessToken)
router.route("/changepassword").post(verifyJWT,changecurrentpassword)
router.route("/current-user").get(verifyJWT,currentuser)
router.route("/update-account").patch(verifyJWT,updateaccountdetails)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateuseravatar)
router.route("/cover-img").patch(verifyJWT,upload.single("coverimg"),updateusercoverimg)
router.route("/channel/:username").get(verifyJWT,getuserchannelprofile)
router.route("/history").get(verifyJWT,getwatchhistory)
export default router