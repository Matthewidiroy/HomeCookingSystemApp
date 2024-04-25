const express = require("express");
const {
  patchUser,
  postUser,
  getUser,
  registerUser,
} = require("../controllers/users");

const router = express.Router();

router.post("/", postUser);
router.post("/register", registerUser);
router.patch("/", patchUser);
router.get("/", getUser);
router.use((request, response) => response.status(404).end());

module.exports = router;
