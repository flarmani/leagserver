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
      data = data.filter(champ => champ.tags.map(t => t.toLowerCase()).includes(tag));
    }

    const paged = data.slice(offset, offset + limit);
    res.json(paged);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch champion data" });
  }
});
