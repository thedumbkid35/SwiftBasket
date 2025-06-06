import express from "express";
import { Product } from "../models/Product.js";
const router = express.Router();


router.get("/", async (req, res) => {
  const products = await Product.findAll();
  res.render("home", { products });
});

export default router;
