const express = require("express");
const router = express.Router();

const controller = require("../controllers/shopController");

router.get("/tienda/shop", controller.shop);
router.get('/tienda/item/:id', controller.showItem);
router.get('/tienda/coleccion/:id', controller.showCollection);
router.get("/tienda/carrito", controller.carrito);


module.exports = router;