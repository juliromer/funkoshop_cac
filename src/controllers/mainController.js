const modelProduct = require("../models/Product");
const modelCollection = require("../models/Collection");


/* INICIO */
/* Traemos todas las colecciones, y ademas los productos que son novedad */
const index = async (req, res) => {
  try {
    const ultimosProductos = await modelProduct.findAll(
      { include: "Collection", 
      where: {
        novedad: 'Si'
      } });
    const colecciones = await modelCollection.findAll();
    res.render("inicio", { ultimosProductos, colecciones });
  } catch (error) {
    res.status(500).send(error);
  }
};


/* CONTACTO, FAQS, ABOUT */

const contacto = (req, res) => {
  res.render("contacto");
};

const faqs = (req, res) => {
  res.render("faqs");
};

const about = (req, res) => {
  res.render("about");
};


module.exports = {
  index,
  contacto,
  faqs,
  about
};
