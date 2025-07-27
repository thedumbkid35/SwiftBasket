import express from "express";
import session from "express-session";
import pgSession from "connect-pg-simple";
import bodyParser from "body-parser";
import flash from "connect-flash";
import dotenv from "dotenv";
import { sequelize, Product } from "./models/Product.js";
import indexRoutes from "./routes/index.js";
import cartRoutes from "./routes/cart.js";
import "./models/order.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const PgSession = pgSession(session);
app.use(
  session({
    store: new PgSession({ conString: process.env.DATABASE_URL }),
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success")[0];
  res.locals.error = req.flash("error")[0];
  res.locals.orderProducts = req.flash("orderProducts")[0];
  res.locals.orderTotal = req.flash("orderTotal")[0];
  next();
});

app.use("/", indexRoutes);
app.use("/", cartRoutes);

// 👇 Auto-seed logic here
async function autoSeed() {
  const count = await Product.count();
  if (count === 0) {
    console.log("No products found. Seeding now...");
    await Product.bulkCreate([
      {
        name: "Bluetooth Earbuds",
        description: "High-quality sound with noise cancellation.",
        price: 1999,
        imageUrl: "/assets/images/earbuds.webp",
      },
      {
        name: "Leather Wallet",
        description: "Genuine leather wallet with card slots.",
        price: 799,
        imageUrl: "/assets/images/wallet.jpg",
      },
      {
        name: "Sports Shoes",
        description: "Breathable running shoes for daily wear.",
        price: 2499,
        imageUrl: "/assets/images/shoes.webp",
      },
      {
        name: "Wireless Keyboard",
        description: "Compact keyboard with long battery life.",
        price: 1299,
        imageUrl: "/assets/images/keyboard.webp",
      },
      {
        name: "Casual Backpack",
        description: "Stylish and lightweight backpack.",
        price: 999,
        imageUrl: "/assets/images/backpack.webp",
      },
      {
        name: "Desk Lamp",
        description: "LED desk lamp with adjustable brightness.",
        price: 599,
        imageUrl: "/assets/images/lamp.jpg",
      },
      {
        name: "Water Bottle",
        description: "Insulated bottle keeps liquids hot/cold.",
        price: 399,
        imageUrl: "/assets/images/bottle.webp",
      },
      {
        name: "Travel Mug",
        description: "Leak-proof stainless steel mug.",
        price: 449,
        imageUrl: "/assets/images/mug.webp",
      },
      {
        name: "Notebook",
        description: "A5 notebook with dotted pages.",
        price: 149,
        imageUrl: "/assets/images/notebook.webp",
      }
    ]);
    console.log("Seeding completed.");
  } else {
    console.log("Products already exist. Skipping seeding.");
  }
}

sequelize.sync({ alter: true }).then(() => {
  autoSeed().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
});
