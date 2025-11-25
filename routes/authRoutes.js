import express from "express";
import mysql from "mysql2/promise";
import { hashPassword, comparePassword, createToken } from "../auth.js";

const router = express.Router();

router.use(express.json());

export default (db) => {

  router.post("/like", async (req, res) => {
  const { userId, movieId } = req.body;

  try {
    await db.query(
      "INSERT INTO usermovie (userId, movieId) VALUES (?, ?)",
      [userId, movieId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

  router.get("/likes/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT movies.* FROM movies JOIN usermovie ON movies.id = usermovie.movieId WHERE usermovie.userId = ?",
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

  // REGISTER
  router.post("/register", async (req, res) => {
    const { username, password,email } = req.body;

    try {
      const hashed = await hashPassword(password);
      await db.query(
        "INSERT INTO users (username, password,email) VALUES (?, ?, ?)",
        [username,
        hashed,
        email]
      );

      res.json({ message: "User registered!" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: "Username already exists!" });
    }
  });

  // LOGIN
  router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    const [rows] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    const user = rows[0];
    console.log(user);
    if (!user) return res.status(400).json({ error: "Invalid username" });

    const isValid = await comparePassword(password, user.password);
    if (!isValid) return res.status(400).json({ error: "Invalid password" });

    const token = createToken(user);
    res.json({ message: "Logged in!", token });
  });

  return router;
};
