import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import produitsRoutes from "./routes/produits.js";
import clientsRoutes from "./routes/clients.js";
import ventesRoutes from "./routes/ventes.js";
import ordonnancesRoutes from "./routes/ordonnances.js";
import stockRoutes from "./routes/stock.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/produits", produitsRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/ventes", ventesRoutes);
app.use("/api/ordonnances", ordonnancesRoutes);
app.use("/api/stock", stockRoutes);

app.get("/", (req, res) => {
  res.send("🚀 AssPharma Backend API is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
