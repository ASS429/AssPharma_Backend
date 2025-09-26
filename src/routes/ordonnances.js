import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM ordonnances ORDER BY created_at DESC");
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { patient, medecin } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO ordonnances (patient, medecin) VALUES ($1,$2) RETURNING *",
    [patient, medecin]
  );
  res.json(rows[0]);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;
  const { rows } = await pool.query(
    "UPDATE ordonnances SET statut=$1 WHERE id=$2 RETURNING *",
    [statut, id]
  );
  res.json(rows[0]);
});

export default router;
