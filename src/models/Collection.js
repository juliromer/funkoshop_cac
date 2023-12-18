const { DataTypes } = require("sequelize");
const sequelize = require("./connect");

const Collection = sequelize.define("Collection", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = Collection;
