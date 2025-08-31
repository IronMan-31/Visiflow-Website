const express = require("express");
const app = express();
const PORT = 3000;

// Serve static files (CSS, JS, images)
app.use(express.static("public"));

// Set EJS as template engine
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Home Page" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About Us" });
});

app.get("/addmachine", (req, res) => {
  res.render("add_machine", { title: "Add Mahine" });
});

app.get("/view_machine", (req, res) => {
  res.render("view_machine", { title: "View Machine" });
});

app.get("/real_time", (req, res) => {
  res.render("real_time", { title: "Real - Time Data" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
