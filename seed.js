import { sequelize, Product } from "./models/Product.js";

(async () => {
  try {
    await sequelize.sync();
    await Product.destroy({ where: {} });

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

    console.log(" Old products deleted and new ones seeded successfully!");
    process.exit();
  } catch (err) {
    console.error(" Error seeding products:", err);
    process.exit(1);
  }
})();
