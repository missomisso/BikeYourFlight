// models/user.js
const bcrypt = require("bcrypt");
const { db } = require("../db");

async function registerUser(username, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await db.collection("users").insertOne({
    username,
    email,
    passwordHash: hashedPassword,
    createdAt: new Date(),
  });

  return result.insertedId;
}

async function getUserByEmail(email) {
  return await db.collection("users").findOne({ email });
}

async function verifyUser(email, password) {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  return isMatch ? user : null;
}

module.exports = {
  registerUser,
  getUserByEmail,
  verifyUser,
};
