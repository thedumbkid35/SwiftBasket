import express from "express";
import { Product } from "../models/Product.js";
import { Order } from "../models/order.js"; 

const router = express.Router();

router.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
});


router.get("/cart", (req, res) => {
  const cart = req.session.cart;
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render("cart", { cart, total });
});


router.post("/cart/add/:id", async (req, res) => {
  const productId = parseInt(req.params.id);
  const quantity = parseInt(req.body.quantity) || 1;

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      req.flash("error", "Product not found.");
      return res.redirect("/");
    }

  
    const existingItem = req.session.cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      req.session.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: quantity
      });
    }

    req.flash("success", "Added to cart.");
    res.redirect("/");
  } catch (err) {
    console.error("Error adding to cart:", err);
    req.flash("error", "Something went wrong.");
    res.redirect("/");
  }
});



router.post("/cart/remove/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  req.session.cart = req.session.cart.filter(item => item.id !== productId);
  req.flash("success", "Removed from cart.");
  res.redirect("/cart");
});


router.post("/cart/checkout", async (req, res) => {
  if (!req.session.cart || req.session.cart.length === 0) {
    req.flash("error", "Cart is already empty.");
    return res.redirect("/cart");
  }

  const { phone, address } = req.body;

  if (!phone || !address) {
    req.flash("error", "Phone number and address are required.");
    return res.redirect("/cart");
  }

  const orderNumber = "ORD" + Math.floor(100000 + Math.random() * 900000);
  const totalAmount = req.session.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  try {
    await Order.create({
      orderNumber,
      products: req.session.cart,
      totalAmount,
      phone,
      address,
    });

    req.flash("success", ` Order placed successfully! Your Order ID: ${orderNumber}`);
    req.flash("orderProducts", JSON.stringify(req.session.cart));
    req.flash("orderTotal", totalAmount.toString());

    req.session.cart = [];
    res.redirect("/cart");
  } catch (err) {
    console.error("Failed to place order:", err);
    req.flash("error", "Failed to place order.");
    res.redirect("/cart");
  }
});

router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.render("order-history", { orders });
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    req.flash("error", "Unable to fetch order history.");
    res.redirect("/");
  }
});


export default router;