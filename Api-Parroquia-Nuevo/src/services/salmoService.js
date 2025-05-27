const axios = require('axios');
const crypto = require('crypto');
const { traducirTexto } = require('../helpers/traductor');

async function getSalmo() {
  const totalSalmos = 150;
  const hoy = new Date();
  const fechaStr = hoy.toISOString().split('T')[0];
  const hash = crypto.createHash('sha256').update(fechaStr).digest('hex');
  const hashNum = parseInt(hash.substring(0, 8), 16);
  const numeroSalmo = (hashNum % totalSalmos) + 1;

  try {
    const url = `https://bible-api.com/psalms%20${numeroSalmo}?translation=web`;
    const response = await axios.get(url);

    const versiculos = response.data.verses;
    const versiculoAleatorio = versiculos[Math.floor(hashNum % versiculos.length)];

    const textoOriginal = versiculoAleatorio.text.trim();
const referenciaOriginal = `${versiculoAleatorio.book_name} ${versiculoAleatorio.chapter}:${versiculoAleatorio.verse}`;

const textoTraducido = await traducirTexto(textoOriginal);
const referencia = await traducirTexto(referenciaOriginal);

    return {
      texto: textoTraducido,
      referencia
    };
  } catch (error) {
    throw new Error("No se pudo obtener el Salmo del día.");
  }
}

module.exports = { getSalmo };
