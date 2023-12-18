const modelProduct = require("../models/Product");
const modelCollection = require("../models/Collection");


/* SHOP */

const shop = async (req, res) => {
  try {
    const productos = await modelProduct.findAll({
      include: "Collection",
    });
    res.render("tienda/shop", { productos });
  } catch (error) {
    res.status(500).send(error);
  }
};


/* ITEM */

const showItem = async (req,res)=>{
  try {
    const productoMain = await modelProduct.findByPk(req.params.id, {
      include: "Collection" }); 
    const productos = await modelProduct.findAll({
        include: "Collection",
      });

    if (productoMain) {
      res.render("tienda/item", { productoMain, productos });
    } else {
      res.status(404).send("No existe el producto.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};


/* COLECCIÓN */

const showCollection = async (req,res)=>{
  try {
    const coleccion = await modelCollection.findByPk(req.params.id);
    const productos = await modelProduct.findAll({
      include: "Collection",
      });
    res.render("tienda/coleccion", { coleccion, productos });
  } catch (error) {
    res.status(500).send(error);
  }
};

const carrito = (req, res) => {
  res.render("tienda/carrito");
};

    
module.exports = {
  shop,
  showItem,
  showCollection,
  carrito
};
