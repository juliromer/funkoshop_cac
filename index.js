require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

const sequelize = require("./src/models/connect");

// const session = require("express-session");
const session = require("cookie-session");

app.use(
  session({
    keys: ["S3cr3t01", "S3cr3t02"],
  })
);

const isLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
};


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/src/views"));

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));
//Probando para imagenes de header. Asi si funciona.
app.use(express.static(__dirname + '/public'));

app.use(require("./src/routes/authRoutes"));

const mainRoutes = require("./src/routes/mainRoutes");
app.use(mainRoutes);

const shopRoutes = require("./src/routes/shopRoutes");
app.use(shopRoutes);

const admincoleccionesRoutes = require("./src/routes/admin/coleccionesRoutes");
app.use("/admin/colecciones", isLogin, admincoleccionesRoutes);

const adminProductosRoutes = require("./src/routes/admin/productosRoutes");
app.use("/admin/productos", isLogin, adminProductosRoutes);



app.use((req, res, next) => {
  res.status(404).send("La pagina no existe.");
});


const PORT = 3000;
app.listen(PORT, async () => {
  try {
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.log(error);
  }

  console.log(`http://localhost:${PORT}`);
});
