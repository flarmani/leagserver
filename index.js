const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;
const BASE = "https://ddragon.leagueoflegends.com";

app.use(cors());

/**
 * GET /champions
 * Optional query params: name, tag, limit, offset, version, lang
 */
app.get("/champions", async (req, res) => {
  try {
    const version = req.query.version || "14.9.1";
    const lang = req.query.lang || "en_US";
    const name = req.query.name?.toLowerCase();
    const tag = req.query.tag?.toLowerCase();
    const limit = parseInt(req.query.limit) || 1000;
    const offset = parseInt(req.query.offset) || 0;

    const url = `${BASE}/cdn/${version}/data/${lang}/champion.json`;
    const response = await axios.get(url);
    let data = Object.values(response.data.data);

    if (name) {
      data = data.filter(champ => champ.id.toLowerCase().includes(name));
    }

    if (tag) {
      data = data.filter(champ =>
        champ.tags.map(t => t.toLowerCase()).includes(tag)
      );
    }

    const paged = data.slice(offset, offset + limit);
    res.json(paged);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch champion data" });
  }
});

/**
 * GET /champions/:id
 * Fetch full details of one champion
 */
app.get("/champions/:id", async (req, res) => {
  try {
    const version = req.query.version || "14.9.1";
    const lang = req.query.lang || "en_US";
    const id = req.params.id;

    const url = `${BASE}/cdn/${version}/data/${lang}/champion/${id}.json`;
    const response = await axios.get(url);
    const champData = response.data.data[id];

    if (!champData) return res.status(404).json({ error: "Champion not found" });
    res.json(champData);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch champion" });
  }
});

/**
 * GET /items
 * Optional query params: name, minGold, tag, version, lang, limit, offset
 */
app.get("/items", async (req, res) => {
  try {
    const version = req.query.version || "14.9.1";
    const lang = req.query.lang || "en_US";
    const name = req.query.name?.toLowerCase();
    const minGold = parseInt(req.query.minGold) || 0;
    const tag = req.query.tag?.toLowerCase();
    const limit = parseInt(req.query.limit) || 1000;
    const offset = parseInt(req.query.offset) || 0;

    const url = `${BASE}/cdn/${version}/data/${lang}/item.json`;
    const response = await axios.get(url);
    let items = Object.values(response.data.data);

    if (name) {
      items = items.filter(item => item.name.toLowerCase().includes(name));
    }

    if (minGold) {
      items = items.filter(item => item.gold?.total >= minGold);
    }

    if (tag) {
      items = items.filter(item =>
        (item.tags || []).map(t => t.toLowerCase()).includes(tag)
      );
    }

    const paged = items.slice(offset, offset + limit);
    res.json(paged);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch item data" });
  }
});

/**
 * GET /versions
 * Returns current and past patch versions
 */
app.get("/versions", async (req, res) => {
  try {
    const url = `${BASE}/api/versions.json`;
    const response = await axios.get(url);
    res.json({ latest: response.data[0], all: response.data });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch versions" });
  }
});

// Root test
app.get("/", (req, res) => {
  res.send("League Patch Proxy is live!");
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
app.get("/champions/:id", async (req, res) => {
  const { id } = req.params;
  const { version = "14.10.1", lang = "en_US" } = req.query;

  const url = `${BASE}/cdn/${version}/data/${lang}/champion/${id}.json`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(404).json({ error: `Champion ${id} not found for version ${version}` });
  }
});
