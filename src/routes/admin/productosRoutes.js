const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const { body } = require("express-validator");

const validations = [
  body("nombre")
    .not()
    .isEmpty()
    .withMessage("El nombre del producto es obligatorio.")
    .bail()
    .isLength({ min: 3 })
    .withMessage("El nombre debe tener al menos 3 caracteres."),
  body("precio").not().isEmpty().withMessage("El precio es obligatorio."),
  body("CollectionId").not().isEmpty().withMessage("La colección es obligatoria."),
];

const controller = require("../../controllers/admin/productosController");


router.get("/", controller.index);

router.get("/create", controller.create);
router.post("/", upload.fields([{name: "imagen"}, {name: "imagen_caja"}]), validations, controller.store);

router.get("/:id/edit", controller.edit);
router.put("/:id", upload.fields([{name: "imagen"}, {name: "imagen_caja"}]), validations, controller.update);


router.delete("/:id", controller.destroy);

module.exports = router;
