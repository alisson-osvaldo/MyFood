// Imports e exports
import {
  carregarHtml,
  bindFunctions
} from './util.js'

import {
  abrirListagemDeProdutos
} from './cadastros/produtos.js';

import {
  abrirListagemDeClientes
} from './cadastros/clientes.js';

import {
  abrirListagemDePedidos
} from './cadastros/pedidos.js';

import {
  abrirListagemDeCategorias
} from './cadastros/categorias.js';

import {
  abrirListagemDeStatus
} from './cadastros/status.js';

import {
  abrirPratoDoDia
} from './cadastros/prato.js';

import {
  abrirClienteLogado
} from './cadastros/logado.js';

export {
  carregarPaginaCadastros
}

// Inicia a página cadastros.
async function carregarPaginaCadastros() {
  await carregarHtml('cadastros', 'main');
  criarBotoesTabs(document.querySelector('div.tab'));
  abrirListagemDeProdutos();
}

function criarBotoesTabs(container){
  const btnProdutos = criarElemento('button', 'produtos')
      .adicionarClasse('tablinks')
      .adicionarClasse('active')
      .adicionarTexto('Produtos');

  const btnClientes = criarElemento('button', 'clientes')
      .adicionarClasse('tablinks')
      .adicionarTexto('Clientes');
   
  const btnPedidos = criarElemento('button', 'pedidos')
      .adicionarClasse('tablinks')
      .adicionarTexto('Pedidos');

  const btnCategorias = criarElemento('button', 'categorias')
      .adicionarClasse('tablinks')
      .adicionarTexto('Categorias');  

  const btnStatus = criarElemento('button', 'status')
      .adicionarClasse('tablinks')
      .adicionarTexto('Status');   
      
  const btnPrato = criarElemento('button', 'pratoDoDia')
      .adicionarClasse('tablinks')
      .adicionarTexto('Prato do dia');  
      
  const btnLogado = criarElemento('button', 'logado')
      .adicionarClasse('tablinks')
      .adicionarTexto('Logado');        

  container.appendChild(btnProdutos);
  container.appendChild(btnClientes);
  container.appendChild(btnPedidos);
  container.appendChild(btnCategorias);
  container.appendChild(btnStatus);   
  container.appendChild(btnPrato);  
  container.appendChild(btnLogado);  
}

function criarElemento(tipo, path){
  const elemento = document.createElement(tipo);
  bindFunctions(elemento);
  elemento.addEventListener('click', event => {
    mudarDeCadastro(event, path)
  });
  return elemento;
}

// Alternador de aba.
async function mudarDeCadastro(e, path) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  selecionarAba(path);

  const div = document.getElementById(path);
  div.style.display = 'block';
  e.currentTarget.className += ' active';
}

// Abas de cadastros.
const abasDeCadastros = new Map();
abasDeCadastros.set('produtos', abrirListagemDeProdutos);
abasDeCadastros.set('clientes', abrirListagemDeClientes);
abasDeCadastros.set('pedidos', abrirListagemDePedidos);
abasDeCadastros.set('categorias', abrirListagemDeCategorias);
abasDeCadastros.set('status', abrirListagemDeStatus);
abasDeCadastros.set('pratoDoDia', abrirPratoDoDia);
abasDeCadastros.set('logado', abrirClienteLogado);

async function selecionarAba(path){
  const fn = abasDeCadastros.get(path);
  if (fn !== undefined) {
    await fn();
  }
}