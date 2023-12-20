const { unlink } = require("fs/promises");
const { existsSync } = require("fs");

const path = require("path");
const sharp = require("sharp");

const { validationResult } = require("express-validator");

const model = require("../../models/Collection");


/* READ */

const index = async (req, res) => {
  try {
    const colecciones = await model.findAll();
    res.render("admin/colecciones/index", { colecciones });
  } catch (error) {
    res.status(500).send(error);
  }
};


/* CREATE */

const create = (req, res) => {
  res.render("admin/colecciones/create");
};

const store = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("admin/colecciones/create", {
      values: req.body,
      errors: errors.array(),
    });
  }

  try {
    const coleccion = await model.create(req.body);
    console.log(coleccion);
    console.log(coleccion.id);

    if (req.file) {
      sharp(req.file.buffer)
        .resize(500)
        .toFile(
          path.resolve(
            __dirname,
            `../../../public/uploads/colecciones/coleccion_${coleccion.id}.webp`
          )
        )
        .catch((err) => console.log(err));
    }

    res.redirect("/admin/colecciones");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};


/* EDIT */

const edit = async (req, res) => {
  try {
    const coleccion = await model.findByPk(req.params.id);

    if (coleccion) {
      res.render("admin/colecciones/edit", { values: coleccion });
    } else {
      res.status(404).send("No existe la colección.");
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
    return res.render("admin/colecciones/edit", {
      values: req.body,
      errors: errors.array(),
    });
  }

  try {
    const affected = await model.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (affected[0] == 1) {
      if (req.file) {
        sharp(req.file.buffer)
          .resize(500)
          .toFile(
            path.resolve(
              __dirname,
              `../../../public/uploads/colecciones/coleccion_${req.params.id}.webp`
            )
          )
          .catch((err) => console.log(err));
      }

      res.redirect("/admin/colecciones");
    } else {
      res.status(400).send("No se pudo actualizar la colección.");
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
            `../../../public/uploads/colecciones/coleccion_${req.params.id}.webp`
          )
        )
      ) {
        await unlink(
          path.resolve(
            __dirname,
            `../../../public/uploads/colecciones/coleccion_${req.params.id}.webp`
          )
        );
      }
    }

    res.redirect("/admin/colecciones");
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
