const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const { body } = require("express-validator");

const validations = [
  body("nombre")
    .not()
    .isEmpty()
    .withMessage("El nombre de la colección es obligatorio.")
    .bail()
    .isLength({ min: 3 })
    .withMessage("El nombre debe tener al menos 3 caracteres."),
];

const controller = require("../../controllers/admin/coleccionesController");


router.get("/", controller.index);

router.get("/create", controller.create);
router.post("/", upload.single("imagen"), validations, controller.store);

router.get("/:id/edit", controller.edit);
router.put("/:id", upload.single("imagen"), validations, controller.update);

router.delete("/:id", controller.destroy);


module.exports = router;

