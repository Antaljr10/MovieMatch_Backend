import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",  
  database: "movieswiper" 
});
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes(db));
app.use(express.json())



// 🎥 Filmlista lekérése
app.get("/movies", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM movies");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Adatbázis hiba" });
  }
});

// ➕ Új film hozzáadása
app.post("/movies", async (req, res) => {
  const { id,title, description,releaseDate, imageUrl } = req.body;
  try {
    await db.query("INSERT INTO movies (id,title, description,releaseDate, imageUrl) VALUES (?, ?,?, ?,?)", [
     id,
     title,
     description,
     Date.parse(releaseDate),
     imageUrl
    ]);
    res.json({ message: "Film hozzáadva ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Adatbázis hiba" });
  }
});

app.listen(3000, () => console.log("🚀 Backend fut: http://localhost:3000"));
