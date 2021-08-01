// Imports e exports
import {
  adicionarAoCarrinho,
  mostrarTotalDeItensNoCarrinho,
  carregarHtml,
  converterParaRealComCifrao
} from './util.js'

import {
  carregarPaginaCardapio
} from './cardapio.js'

import {
  carregarPaginaCarrinho
} from './carrinho.js'

import {
  carregarPaginaCadastros
} from './cadastros.js'

import {
  carregarPaginaSobre
} from './sobre.js'

// Carregar o cabeçalho.
function carregarHeader(){
  const elemento = document.querySelector("header");
  fetch('html/header.html')
    .then(res => res.text())
    .then(texto => {
      elemento.innerHTML = texto;
    })
    .then(() => {
      const menuCardapio = document.querySelector('#menu-cardapio');
      menuCardapio.firstElementChild.onclick = e => {
        e.preventDefault();
        carregarPaginaCardapio();
        mostrarTotalDeItensNoCarrinho();
      }
      const menuCarrinho = document.querySelector('#menu-carrinho');
      menuCarrinho.firstElementChild.onclick = e => {
        e.preventDefault();
        carregarPaginaCarrinho();
        mostrarTotalDeItensNoCarrinho();
      }
      const menuCadastros = document.querySelector('#menu-cadastros');
      menuCadastros.firstElementChild.onclick = e => {
        e.preventDefault();
        carregarPaginaCadastros();
        mostrarTotalDeItensNoCarrinho();
      }
      const menuSobre = document.querySelector('#menu-sobre');
      menuSobre.firstElementChild.onclick = e => {
        e.preventDefault();
        carregarPaginaSobre();
        mostrarTotalDeItensNoCarrinho();
      }
    });
};

// Carregar o conteúdo.
function carregarBody(){
  carregarPaginaHome();
}

// Carregar o rodapé.
function carregarFooter(){
  carregarHtml("footer", "footer");
}

// Carregar página home.
async function carregarPaginaHome() {
  await carregarHtml('home', 'main');
  mostrarTotalDeItensNoCarrinho();

  const btnAdicionar = document.querySelector('#btnAdicionar');
  const id = document.querySelector('#id');

  btnAdicionar.onclick = function(){
    adicionarAoCarrinho(id.value, 0); 
  }

  fetch('http://localhost:8000/pratododia') 
  .then(res => res.json())
  .then(pratoDoDia => {
    document.querySelector('#id').value = pratoDoDia.id;
    document.querySelector('.home-prato-foto').src = 'img/' + pratoDoDia.foto;
    document.querySelector('.home-prato-nome').innerHTML = pratoDoDia.nome;
    document.querySelector('.home-prato-secao').innerHTML = 'Prato do dia';
    const preco = converterParaRealComCifrao(pratoDoDia.preco);
    document.querySelector('.home-prato-preco').innerHTML = preco;
    document.querySelector('.home-prato-ingredientes').innerHTML = 'Ingredientes';
    document.querySelector('.home-prato-descricao').innerHTML = pratoDoDia.descricao;
    document.querySelector("body > div > main > section").style.display = "flex";
  });
}
// Carregar o index.
(function () {
  carregarHeader();
  carregarBody();
  carregarFooter();
})();
