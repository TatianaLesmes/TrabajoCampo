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

// Ejemplo de uso
(async () => {
  const texto = 'The Lord is my shepherd; I shall not want.';
  const traduccion = await traducirTexto(texto);
  console.log('Traducción:', traduccion);
})();
