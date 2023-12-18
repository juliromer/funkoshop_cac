const modelProduct = require("../models/Product");
const modelCollection = require("../models/Collection");


/* INICIO */

const index = async (req, res) => {
  try {
    const productos = await modelProduct.findAll({
      include: "Collection",
    });
    const colecciones = await modelCollection.findAll();
    res.render("inicio", { productos, colecciones });
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
