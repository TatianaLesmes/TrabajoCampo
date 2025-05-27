const { getSalmo } = require('../services/salmoService');

async function obtener(req, res) {
  try {
    const salmo = await getSalmo();
    res.json(salmo);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { obtener };
