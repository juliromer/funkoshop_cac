const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");

const model = require("../models/User");


/* REGISTER */

const register = (req, res) => {
  res.render("auth/register");
};

const postRegister = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("auth/register", {
      values: req.body,
      errors: errors.array(),
    });
  }

  try {
    const user = await model.create(req.body);
    res.redirect("/admin/productos");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};


/* LOGIN */

const login = (req, res) => {
  res.render("auth/login");
};

const postLogin = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("auth/login", {
      values: req.body,
      errors: errors.array(),
    });
  }

  try {
    const user = await model.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      res.render("auth/login", {
        values: req.body,
        errors: [{ msg: "El correo es incorrecto." }],
      });
    } else if (!(await bcryptjs.compare(req.body.password, user.password))) {
      res.render("auth/login", {
        values: req.body,
        errors: [
          { msg: "La contraseña es incorrecta." },
        ],
      });
    } else {
      req.session.userId = user.id;
      res.redirect("/admin/productos");
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};


/* LOGOUT */

const logout = (req, res) => {
  req.session = null;
  res.redirect("/");
};


module.exports = {
  register,
  postRegister,
  login,
  postLogin,
  logout,
};
