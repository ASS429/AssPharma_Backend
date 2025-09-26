import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM clients ORDER BY id DESC");
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { nom, telephone, adresse } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO clients (nom, telephone, adresse) VALUES ($1,$2,$3) RETURNING *",
    [nom, telephone, adresse]
  );
  res.json(rows[0]);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nom, telephone, adresse, credit } = req.body;
  const { rows } = await pool.query(
    "UPDATE clients SET nom=$1, telephone=$2, adresse=$3, credit=$4 WHERE id=$5 RETURNING *",
    [nom, telephone, adresse, credit, id]
  );
  res.json(rows[0]);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM clients WHERE id=$1", [id]);
  res.json({ message: "Client supprimé" });
});

export default router;
