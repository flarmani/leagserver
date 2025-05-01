app.get("/champions", async (req, res) => {
  try {
    const version = req.query.version || "14.9.1";
    const lang = req.query.lang || "en_US";
    const filter = req.query.name?.toLowerCase();
    const tag = req.query.tag;

    const url = `${BASE}/cdn/${version}/data/${lang}/champion.json`;
    const response = await axios.get(url);
    let data = Object.values(response.data.data);

    if (filter) {
      data = data.filter(champ => champ.id.toLowerCase().includes(filter));
    }

    if (tag) {
      data = data.filter(champ =>
        champ.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
      );
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch champion data" });
  }
});
