
import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
});

const Product = sequelize.define("Product", {
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  price: DataTypes.FLOAT,
  imageUrl: DataTypes.STRING,
});

export { sequelize, Product };
