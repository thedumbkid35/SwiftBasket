import express from "express";
import session from "express-session";
import pgSession from "connect-pg-simple";
import bodyParser from "body-parser";
import flash from "connect-flash";
import dotenv from "dotenv";
import { sequelize } from "./models/Product.js";
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

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
