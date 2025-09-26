import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// Historique mouvements stock
router.get("/", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM mouvements_stock ORDER BY created_at DESC");
  res.json(rows);
});

// Entrée stock
router.post("/entree", async (req, res) => {
  const { produit_id, quantite, utilisateur } = req.body;

  await pool.query(
    "INSERT INTO mouvements_stock (produit_id, type, quantite, utilisateur) VALUES ($1,'entree',$2,$3)",
    [produit_id, quantite, utilisateur]
  );

  await pool.query("UPDATE produits SET stock = stock + $1 WHERE id=$2", [quantite, produit_id]);

  res.json({ message: "Entrée stock enregistrée" });
});

// Sortie stock
router.post("/sortie", async (req, res) => {
  const { produit_id, quantite, utilisateur } = req.body;

  await pool.query(
    "INSERT INTO mouvements_stock (produit_id, type, quantite, utilisateur) VALUES ($1,'sortie',$2,$3)",
    [produit_id, quantite, utilisateur]
  );

  await pool.query("UPDATE produits SET stock = stock - $1 WHERE id=$2", [quantite, produit_id]);

  res.json({ message: "Sortie stock enregistrée" });
});

export default router;
