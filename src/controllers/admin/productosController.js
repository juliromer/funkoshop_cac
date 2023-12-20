const { unlink } = require("fs/promises");
const { existsSync } = require("fs");

const path = require("path");
const sharp = require("sharp");

const { validationResult } = require("express-validator");

const model = require("../../models/Product");
const modelCollection = require("../../models/Collection");


/* READ */

const index = async (req, res) => {
  try {
    const productos = await model.findAll({
      include: "Collection",
    });
    res.render("admin/productos/index", { productos });
  } catch (error) {
    res.status(500).send(error);
  }
};


/* CREATE */

const create = async (req, res) => {
  try {
    const colecciones = await modelCollection.findAll();
    res.render("admin/productos/create", { colecciones });
  } catch (error) {
    res.status(500).send(error);
  }
};

const store = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    try {
      const colecciones = await modelCollection.findAll();
      return res.render("admin/productos/create", {
        colecciones,
        values: req.body,
        errors: errors.array(),
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  try {
    const producto = await model.create(req.body);
    if (req.files.imagen) {
      sharp(req.files.imagen[0].buffer)
        .resize(500)
        .toFile(
          path.resolve(
            __dirname,
            `../../../public/uploads/productos/producto_${producto.id}.webp`
          )
        )
        .catch((err) => console.log(err));
    }

    if (req.files.imagen_caja) {
      sharp(req.files.imagen_caja[0].buffer)
        .resize(500)
        .toFile(
          path.resolve(
            __dirname,
            `../../../public/uploads/productos/producto_caja_${producto.id}.webp`
          )
        )
        .catch((err) => console.log(err));
    } 

    res.redirect("/admin/productos");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};


/* EDIT */

const edit = async (req, res) => {
  try {
    const producto = await model.findByPk(req.params.id);

    if (producto) {
      const colecciones = await modelCollection.findAll();
      res.render("admin/productos/edit", { values: producto, colecciones });
    } else {
      res.status(404).send("No existe el producto.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};


/* UPDATE */

const update = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    try {
      const colecciones = await modelCollection.findAll();
      return res.render("admin/productos/edit", {
        colecciones,
        values: req.body,
        errors: errors.array(),
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  try {
    const affected = await model.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (affected[0] == 1) {

      if (req.files.imagen) {
        sharp(req.files.imagen[0].buffer)
          .resize(500)
          .toFile(
            path.resolve(
              __dirname,
              `../../../public/uploads/productos/producto_${req.params.id}.webp`
            )
          )
          .catch((err) => console.log(err));
      }
  
      if (req.files.imagen_caja) {
        sharp(req.files.imagen_caja[0].buffer)
          .resize(500)
          .toFile(
            path.resolve(
              __dirname,
              `../../../public/uploads/productos/producto_caja_${req.params.id}.webp`
            )
          )
          .catch((err) => console.log(err));
      } 

      res.redirect("/admin/productos");
      
    } else {
      res.status(400).send("No se pudo actualizar el producto.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};


/* DELETE */

const destroy = async (req, res) => {
  try {
    const destroyed = await model.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (destroyed == 1) {
      if (
        existsSync(
          path.resolve(
            __dirname,
            `../../../public/uploads/productos/producto_${req.params.id}.webp`
          )
        )
      ) {
        await unlink(
          path.resolve(
            __dirname,
            `../../../public/uploads/productos/producto_${req.params.id}.webp`
          )
        );
      }

      if (
        existsSync(
          path.resolve(
            __dirname,
            `../../../public/uploads/productos/producto_caja_${req.params.id}.webp`
          )
        )
      ) {
        await unlink(
          path.resolve(
            __dirname,
            `../../../public/uploads/productos/producto_caja_${req.params.id}.webp`
          )
        );
      }
    }

    res.redirect("/admin/productos");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};


module.exports = {
  index,
  create,
  store,
  edit,
  update,
  destroy,
};
