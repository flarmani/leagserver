const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const BASE = "https://ddragon.leagueoflegends.com";

app.get("/champions", async (req, res) => {
  try {
    const version = req.query.version || "14.9.1";
    const lang = req.query.lang || "en_US";
    const url = `${BASE}/cdn/${version}/data/${lang}/champion.json`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch champion data" });
  }
});

app.get("/items", async (req, res) => {
  try {
    const version = req.query.version || "14.9.1";
    const lang = req.query.lang || "en_US";
    const url = `${BASE}/cdn/${version}/data/${lang}/item.json`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch item data" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});

