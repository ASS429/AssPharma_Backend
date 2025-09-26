import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// Tous les produits
router.get("/", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM produits ORDER BY id DESC");
  res.json(rows);
});

// Un produit
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query("SELECT * FROM produits WHERE id=$1", [id]);
  res.json(rows[0]);
});

// Ajouter produit
router.post("/", async (req, res) => {
  const { nom, dci, code_barres, forme, rayon, prix, stock, date_expiration } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO produits (nom, dci, code_barres, forme, rayon, prix, stock, date_expiration) 
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [nom, dci, code_barres, forme, rayon, prix, stock, date_expiration]
  );
  res.json(rows[0]);
});

// Modifier produit
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nom, dci, code_barres, forme, rayon, prix, stock, date_expiration } = req.body;
  const { rows } = await pool.query(
    `UPDATE produits SET nom=$1, dci=$2, code_barres=$3, forme=$4, rayon=$5, prix=$6, stock=$7, date_expiration=$8
     WHERE id=$9 RETURNING *`,
    [nom, dci, code_barres, forme, rayon, prix, stock, date_expiration, id]
  );
  res.json(rows[0]);
});

// Supprimer produit
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM produits WHERE id=$1", [id]);
  res.json({ message: "Produit supprimé" });
});

export default router;
