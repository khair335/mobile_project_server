const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");
const app = express();
app.use(express.json());
app.use(cors());
require("dotenv").config();
const path = require("path");

//routers
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/auth");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const initialDataRoutes = require("./routes/admin/initialData");
const pageRoutes = require("./routes/admin/page");

// mongodb+srv://admin:<password>@cluster0.yam67.mongodb.net/?retryWrites=true&w=majority

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nykjldb.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Database connected");
  });
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", initialDataRoutes);
app.use("/api", pageRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running ${process.env.PORT}`);
});
// PORT=2000
// DB_USER=shahadathossain4536
// DB_PASS=V0944c3wdBVTGNK9
// DB_DATABASE=mobile_project
// JWT_SECRET=MERNSECRET3
// API=http://localhost:2000/public/

// # const uri = 'mongodb+srv://shahadathossain4536:V0944c3wdBVTGNK9@cluster0.nykjldb.mongodb.net/?retryWrites=true&w=majority';