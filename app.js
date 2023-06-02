const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const teacherRoute = require("./Routes/teacherRoute");
const childRoute = require("./Routes/childRoute");
const classRoute = require("./Routes/classRoute");
const authenicatedRouter = require("./Routes/authenticationRoute");
const { authenticated } = require("./Middlewares/Auth/authMWPremissions");

const app = express();
let port = process.env.PORT || 8080;

//connection with mongodb
mongoose
  .connect("mongodb://127.0.0.1:27017/nurserySystem", { useNewUrlParser: true })
  .then(() => {
    console.log("DB connected");
    app.listen(port, () => {
      console.log("listening........");
    });
  })
  .catch((error) => {
    console.log("DB connection problem" + error);
  });

app.use(cors());

//:method :url :status :res[content-length] - :response-time ms
app.use(morgan("tiny"));
app.use(express.json());

app.use(authenicatedRouter);
app.use(authenticated);

// Routes
app.use(teacherRoute);
app.use(childRoute);
app.use(classRoute);

// not Found Middleware
app.use((request, response, next) => {
  response.status(404).json({ message: "Page Not Found" });
});

// Error Middleware
app.use((error, request, response, next) => {
  response.status(500).json({ message: error + "" });
});
