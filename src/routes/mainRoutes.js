const express = require("express");
const router = express.Router();

const controller = require("../controllers/mainController");

router.get("/", controller.index);
router.get("/contacto", controller.contacto);
router.get("/faqs", controller.faqs);
router.get("/about", controller.about);


module.exports = router;