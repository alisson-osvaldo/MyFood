// Imports e exports
import {
  adicionarAoCarrinho,
  carregarHtml,
  criarElemento,
  converterParaRealComCifrao
} from './util.js'

export {
  carregarPaginaCardapio
};

// Inicia a página cardápio.
async function carregarPaginaCardapio() {
  await carregarHtml('cardapio', 'main');
  await fetch('http://localhost:8000/produtos')
  .then(response => response.json())
  .then(json => {
    json.forEach( produto => {
      const card = criarCard(produto);
      const section = document.querySelector('section.cardapio');
      section.appendChild(card);
    })  
  });
};

// Cria um card de produto.
function criarCard(produto){
  const divPrato = criarElemento('div')
      .adicionarClasse('card-prato');
  const spanTitulo = criarElemento('span')
      .adicionarClasse('card-titulo')
      .adicionarTexto(produto.nome);
  const img = criarElemento('img');
  img.src = "./img/" + produto.foto;
  const divConteudo = criarElemento('div')
       .adicionarClasse('card-conteudo');
  const spanPreco = criarElemento('span')
       .adicionarClasse('card-preco')
       .adicionarTexto(converterParaRealComCifrao(produto.preco));
  const spanTexto = criarElemento('span')
       .adicionarClasse('card-texto')
       .adicionarTexto(produto.descricao);
  const btnAdicionar = criarElemento('button')
       .adicionarClasse('card-texto')
       .adicionarTexto('Adicionar ao carrinho'); 

  btnAdicionar.onclick = function(){
    adicionarAoCarrinho(String(produto.id), 0);
  }

  divConteudo.incluirFilho(spanPreco)
  .incluirFilho(spanTexto)
  .incluirFilho(btnAdicionar);
  divPrato.incluirFilho(spanTitulo)
    .incluirFilho(img)
    .incluirFilho(divConteudo);


  return divPrato;
}