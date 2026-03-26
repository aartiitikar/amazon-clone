const mongoose = require("mongoose");

const signSchema = new mongoose.Schema({
    number: Number,
    fullName: String,
    email: String,
    password: String,
})

module.exports = mongoose.model("Signup", signSchema);