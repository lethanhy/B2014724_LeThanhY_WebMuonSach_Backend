const express = require("express");
const cors = require("cors");
const contactsRouter = require("./app/routes/conatct.route");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/contacts", contactsRouter);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to web book application. "});
});

module.exports = app;

