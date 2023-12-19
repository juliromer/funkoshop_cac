const { DataTypes } = require("sequelize");
const sequelize = require("./connect");

const Collection = require("./Collection");

const Product = sequelize.define("Product", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  descuento: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  cuotas: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  novedad: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});


Product.belongsTo(Collection);

module.exports = Product;
