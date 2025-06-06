import { DataTypes } from "sequelize";
import { sequelize } from "./Product.js";

export const Order = sequelize.define("Order", {
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  products: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  address: {
  type: DataTypes.STRING,
  allowNull: true,
},
phone: {
  type: DataTypes.STRING,
  allowNull: true, 
},

});
