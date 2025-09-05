const express = require("express");
const router = express.Router();
const MachineProfile = require("../apis/machine_profs");

// Middleware to check if user is authenticated
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", "Please log in to view this page");
    res.redirect("/login");
  }
};

// Home page
router.get("/dashboard", ensureAuth, (req, res) => {
  if (req.isAuthenticated()) {
    res.render("dashboard", {
      title: "Dashboard - River Monitoring",
      user: req.user,
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/addmachine", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("add_machine", { title: "Add Mahine" });
  } else {
    res.redirect("/login");
  }
});

router.get("/view_machine", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("view_machine", { title: "View Machine" });
  } else {
    res.redirect("/login");
  }
});

router.get("/user_detail", (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// POST /machine_profile
router.post("/machine_profile", async (req, res) => {
  try {
    const data = req.body;
    const resp = await MachineProfile.create(data);
    console.log(resp);
    res.json(resp);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

router.post("/user_machines", async (req, res) => {
  try {
    const data = req.body;
    const resp = await MachineProfile.find(data);
    console.log(resp);
    res.send(resp);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

router.delete("/user_machines", async (req, res) => {
  try {
    const data = req.body;
    let resp = await MachineProfile.deleteOne(data);
    console.log(resp);
    res.send(resp);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
// Login page
router.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  res.render("login", {
    title: "Login - River Monitoring",
  });
});

// Signup page
router.get("/signup", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  res.render("signup", {
    title: "Sign Up - River Monitoring",
  });
});

module.exports = router;
