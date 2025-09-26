import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// Liste ventes
router.get("/", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM ventes ORDER BY created_at DESC");
  res.json(rows);
});

// Ajouter une vente + articles
router.post("/", async (req, res) => {
  const client = req.body.client_id || null;
  const { total, mode_paiement, type_vente, articles } = req.body;

  try {
    const vente = await pool.query(
      "INSERT INTO ventes (client_id, total, mode_paiement, type_vente) VALUES ($1,$2,$3,$4) RETURNING *",
      [client, total, mode_paiement, type_vente]
    );

    const venteId = vente.rows[0].id;

    for (const art of articles) {
      await pool.query(
        "INSERT INTO vente_articles (vente_id, produit_id, quantite, prix) VALUES ($1,$2,$3,$4)",
        [venteId, art.produit_id, art.quantite, art.prix]
      );

      // Décrémenter stock
      await pool.query("UPDATE produits SET stock = stock - $1 WHERE id=$2", [
        art.quantite,
        art.produit_id,
      ]);
    }

    res.json(vente.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l’enregistrement de la vente" });
  }
});

export default router;
