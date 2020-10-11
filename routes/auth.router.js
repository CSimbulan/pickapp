/*
Api routes for user.
*/
const router = require("express").Router();

const {
  validRegister,
  validLogin,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../helpers/valid");

/*
Load and use controllers.
*/
const {
  registerController,
  activationController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  googleController,
  facebookController,
} = require("../controllers/auth.controller.js");

const {
  getUsersController,
  getUserByIdController,
  usersQueryController,
} = require("../controllers/users.controller.js");

router.post("/register", validRegister, registerController);
router.post("/login", validLogin, loginController);
router.post("/activate", activationController);

router.put(
  "/forgotpassword",
  forgotPasswordValidator,
  forgotPasswordController
);
router.put("/resetpassword", resetPasswordValidator, resetPasswordController);

router.post("/googlelogin", googleController);
router.post("/facebooklogin", facebookController);

router.get("/users", getUsersController);
router.get("/users/query", usersQueryController);
router.get("/users/findbyid/:id", getUserByIdController);

module.exports = router;
