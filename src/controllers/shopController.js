const modelProduct = require("../models/Product");
const modelCollection = require("../models/Collection");


/* SHOP */
/* Traer todos los productos */
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
/* Traer el item seleccionado, y tambien los productos de la misma coleccion */
const showItem = async (req, res) => {
  try {
    const productoMain = await modelProduct.findByPk(req.params.id, {
      include: "Collection"
    });
    const productos = await modelProduct.findAll({
      include: "Collection", where: {
        CollectionId: productoMain.Collection.id
      }
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
/* Traer la coleccion seleccionada, y tambien todos los productos de esa coleccion */
const showCollection = async (req, res) => {
  try {
    const coleccion = await modelCollection.findByPk(req.params.id);
    const productos = await modelProduct.findAll({
      include: "Collection", where: {
        CollectionId: coleccion.id
      }
    });
    res.render("tienda/coleccion", { coleccion, productos });
  } catch (error) {
    res.status(500).send(error);
  }
};


/* CARRITO */
/* Crea y agrega un item al carrito */
const addCart = async (req, res) => {
  if (!req.session.cart) {
    const cart = {
      items: [],
    };
    req.session.cart = cart;
  }

  const index = req.session.cart.items.findIndex(
    (item) => item.id == req.params.id
  );

  const productoCarrito = await modelProduct.findByPk(req.params.id, {
    include: "Collection"
  });

  if (index != -1) {
    req.session.cart.items[index].cantidad++;
  } else {
    req.session.cart.items.push({
      id: productoCarrito.id,
      nombre: productoCarrito.nombre,
      colleccion: productoCarrito.Collection.nombre,
      precio: productoCarrito.precio,
      cantidad: 1
    });
  }
  res.redirect("/tienda/carrito");
};


/* CARRITO */
/* Crea el carrito, y lo muestra con todos los items (si es que tiene) */
const showCart = async (req, res) => {
  if (!req.session.cart) {
    const cart = {
      items: [],
    };
    req.session.cart = cart;
  }
  try {
    const carritoItems = req.session.cart.items
    res.render("tienda/carrito", { carritoItems });
  } catch (error) {
    res.status(500).send(error);
  }
};


module.exports = {
  shop,
  showItem,
  showCollection,
  addCart,
  showCart,
};
