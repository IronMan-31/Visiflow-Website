const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  machine_name: {
    type: String,
    required: true,
  },
  machine_code: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("machine_profile", schema);
