// Imports e exports
import {
  carregarHtml
} from './util.js'

export {
  carregarPaginaSobre
};

// Inicia a página sobre.
async function carregarPaginaSobre() {
  await carregarHtml('sobre', 'main');
};