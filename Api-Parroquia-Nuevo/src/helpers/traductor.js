const translate = require('translate-google');

async function traducirTexto(texto, targetLang = 'es') {
  try {
    const resultado = await translate(texto, { to: targetLang });
    return resultado;
  } catch (error) {
    console.error("Error al traducir:", error.message);
    return texto;
  }
}

module.exports = { traducirTexto };
