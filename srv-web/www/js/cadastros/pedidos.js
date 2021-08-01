// Imports e exports
import {
  carregarHtml,
  criarElemento,
  getDataEmDDMMYYYY,
  converterParaRealComCifrao,
  formatarCPF
} from '../util.js'

export {
  abrirListagemDePedidos
}

// Listagem de pedidos
async function abrirListagemDePedidos() {
  await carregarHtml("pedidos/listar", "#pedidos");
  fetch('http://localhost:8000/pedidos')
  .then(response => response.json())
  .then(json => {
    const tbody = document.querySelector('table.pedidos > tbody');
    json.forEach( pedido => {
      const linhaPedido= criarLinhaPedido(pedido);
      tbody.appendChild(linhaPedido);
      const linhaItens = criarLinhaItens(pedido.id, pedido.itens);
      tbody.appendChild(linhaItens);
    })  
  });
}

function exibirDetalhes(idPedido){
  const seletor = '#id_' + idPedido; 
  const trDetalhes = document.querySelector(seletor);
  const visivel = trDetalhes.getAttribute('visivel');
  if (visivel === 'true') {
    trDetalhes.style.display = 'none';
    trDetalhes.setAttribute('visivel', false);
  } else {
    trDetalhes.style.display = 'table-row';
    trDetalhes.setAttribute('visivel', true);
  }
}

// Cria linhas da tabela item.
function criarLinhaItens(idPedido, itens){
  const identificador = 'id_' + idPedido; 
  const linhaItens = criarElemento('tr');
  linhaItens.setAttribute('id', identificador);
  linhaItens.setAttribute('visivel', false);
  linhaItens.style.width = '100%';
  linhaItens.style.display = 'none';
  const tdInicial = criarElemento('td');
  tdInicial.setAttribute('colspan', '2');
  linhaItens.incluirFilho(tdInicial);
  const tdColspan = criarElemento('td');
  tdColspan.setAttribute('colspan', '5');
  const tableItens = criarElemento('table').adicionarClasse('pedidoItens');
  const theadItens = criarElemento('thead');
  const thNome = criarElemento('th').adicionarTexto('Nome');
    thNome.style.paddingLeft = '20px';
  const thQtde = criarElemento('th').adicionarTexto('Quantidade').adicionarClasse('alinhaNoCentro');
  thQtde.style.width = '100px';
  const thUnit = criarElemento('th').adicionarTexto('Valor unitário').adicionarClasse('alinhaADireita');
  thUnit.style.width = '100px';
  const thTotal = criarElemento('th').adicionarTexto('Valor total').adicionarClasse('alinhaADireita');
  thTotal.style.width = '100px';
  theadItens.incluirFilho(thNome);
  theadItens.incluirFilho(thQtde);
  theadItens.incluirFilho(thUnit);
  theadItens.incluirFilho(thTotal);
  tableItens.incluirFilho(theadItens);
  const tbodyItens = criarElemento('tbody');
  itens.forEach(item => {
    const linhaItem = criarElemento('tr');
    const tdNome = criarElemento('td').adicionarTexto(item.nome);
    tdNome.style.paddingLeft = '20px';
    const tdQtde = criarElemento('td').adicionarTexto(item.quantidade)
           .adicionarClasse('alinhaNoCentro');
    const tdUnit = criarElemento('td')
          .adicionarTexto(converterParaRealComCifrao(item.preco))
           .adicionarClasse('alinhaADireita');
    const valor = parseFloat(item.quantidade) * parseFloat(item.preco);
    const tdTotal = criarElemento('td')
          .adicionarTexto(converterParaRealComCifrao(valor))
          .adicionarClasse('alinhaADireita');
    linhaItem.incluirFilho(tdNome);
    linhaItem.incluirFilho(tdQtde);
    linhaItem.incluirFilho(tdUnit);
    linhaItem.incluirFilho(tdTotal);
    tbodyItens.incluirFilho(linhaItem);
  })
  tableItens.incluirFilho(tbodyItens);
  tdColspan.incluirFilho(tableItens);
  linhaItens.incluirFilho(tdColspan);
  return linhaItens;
}

// Cria linhas da tabela pedido.
function criarLinhaPedido(pedido){
  const linhaPedido = criarElemento('tr');
  const cliente = pedido.cliente;
  const status = pedido.status;
  const data = getDataEmDDMMYYYY(pedido.data);
  linhaPedido.incluirFilho(criarElemento('td').adicionarTexto(pedido.id));
  linhaPedido.incluirFilho(criarElemento('td').adicionarTexto(data));
  linhaPedido.incluirFilho(criarElemento('td').adicionarTexto(cliente.nome));
  const cpf = formatarCPF(cliente.cpf);
  linhaPedido.incluirFilho(criarElemento('td').adicionarTexto(cpf));
  linhaPedido.incluirFilho(criarElemento('td').adicionarTexto(cliente.fone));
  linhaPedido.incluirFilho(criarElemento('td').adicionarTexto(status.nome));
  const valor = converterParaRealComCifrao(pedido.total);

  linhaPedido.incluirFilho(criarElemento('td')
          .adicionarClasse('alinhaADireita')
          .adicionarTexto(valor));
  criarActions(linhaPedido, "pedidos", pedido.id);
  return linhaPedido;
}

// Cria ações de exclusão e edição.
function criarActions(linha, path, idPedido){
  const td = criarElemento('td')
           .adicionarClasse('alinhaADireita');

  const linkDetalhes = criarElemento('a');
  linkDetalhes.adicionarTexto('Detalhes');
  linkDetalhes.style.display = 'inline-block';
  linkDetalhes.style.width = '40px';
  linkDetalhes.style.marginRight = '15px';
  linkDetalhes.href = path + "/" + idPedido;
  linkDetalhes.onclick = async e => {
    e.preventDefault();
    exibirDetalhes(idPedido);
  }
  td.incluirFilho(linkDetalhes)
  linha.incluirFilho(td);         

  const linkEditar = criarElemento('a');
  linkEditar.adicionarTexto('Editar');
  linkEditar.style.display = 'inline-block';
  linkEditar.style.width = '30px';
  linkEditar.href = path + "/" + idPedido;
  linkEditar.onclick = async e => {
    e.preventDefault();
    editarPedidos(idPedido);
  }
  td.incluirFilho(linkEditar)
  linha.incluirFilho(td);
}

async function editarPedidos(id) {
  await carregarHtml('pedidos/editar', '#pedidos');
  const form = document.forms.pedidos;
  fetch('http://localhost:8000/pedidos/' + id)
  .then(response => response.json())
  .then(pedido => {
    const cliente = pedido.cliente;
    form.id.value = pedido.id;
    form.data.value = getDataEmDDMMYYYY(pedido.data);
    form.nome.value = cliente.nome;

    fetch('http://localhost:8000/status')
      .then(res => res.json())
      .then(jsonStatus => {
        const selectStatus = document.querySelector("#status");
        jsonStatus.forEach(status => {
          const option = document.createElement('option');
          option.value = parseInt(status.id);
          option.innerHTML = status.nome;
          if (status.id === parseInt(pedido.status.id)) {
            option.selected = true;
          }
          selectStatus.appendChild(option);
        });
      });
    popularItensDoPedido(pedido.itens);
    sessionStorage.setItem("itensPedido", JSON.stringify(pedido.itens));
  });

  btnSalvar.addEventListener('click', () => {
    const form = document.forms.pedidos;
    fetch('http://localhost:8000/pedidos/' + form.id.value)
      .then(response => response.json())
      .then(pedido => {
        const selectStatus = document.querySelector("#status");
        const idStatus = selectStatus.value;
        fetch('http://localhost:8000/status/' + idStatus)
          .then(res => res.json())
          .then(status => {
            pedido.status = status;
            pedido.itens = JSON.parse(sessionStorage.getItem("itensPedido"));
            let vlrTotal = 0;
            pedido.itens.forEach(item => {
              vlrTotal += parseFloat(item.quantidade) * parseFloat(item.preco);
            });
            pedido.total = vlrTotal;
          })
          .then(() => {
            const header = { 
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
              },
              body: JSON.stringify(pedido)
            }
            fetch('http://localhost:8000/pedidos/' + id, header)
              .then(() => {
                 abrirListagemDePedidos();
              });
          });
      });
  });

  const btnCancelar = document.querySelector("#btnCancelar");
  btnCancelar.addEventListener('click', () => {
    abrirListagemDePedidos();
  });
}

function popularItensDoPedido(itens) {
  let vlrTotal = 0;
  const tdVlrTotal = document.querySelector('#vlrTotal');
  const tbodyItensPedido = document.querySelector("#itensPedido > tbody");
  tbodyItensPedido.innerHTML = '';
  itens.forEach(item => {
    vlrTotal += parseFloat(item.quantidade) * parseFloat(item.preco);
    const linha = criarLinhaDeItem(item);
    tbodyItensPedido.appendChild(linha);
  });
  tdVlrTotal.innerHTML = converterParaRealComCifrao(vlrTotal);
}

function alterarItemPedido(idItem, qtdeAtual) {
  let itensPedido = sessionStorage.getItem("itensPedido");
  let memoryItens = JSON.parse(itensPedido);
  for (const i in memoryItens) {
    const item = memoryItens[i];
    if (parseInt(idItem) === item.id){
      item.quantidade = qtdeAtual;
      memoryItens[i] = item;
      break;
    }
  }
  popularItensDoPedido(memoryItens);
  sessionStorage.setItem("itensPedido", JSON.stringify(memoryItens));
}

// Cria linha item.
function criarLinhaDeItem(item){

  const valor = parseFloat(item.quantidade) * parseFloat(item.preco);

  const linha = criarElemento('tr');
  linha.incluirFilho(criarElemento('td')
      .adicionarClasse('alinhaAEsquerda')
      .adicionarTexto(item.nome));

  const btnDown = criarElemento('img')
      .adicionarClasse('btnDown');
  btnDown.src = '../img/btn_down.png';

  const btnUp = criarElemento('img')
      .adicionarClasse('btnUp');
  btnUp.src = '../img/btn_up.png';

  const input = criarElemento('input');
  input.setAttribute("type", "text");
  input.idProduto = item.id;
  input.quantidade = item.quantidade;
  input.value = item.quantidade;
  input.onchange = function(){
    const quantidade = parseInt(this.value);
    if (quantidade >= 0){
      alterarItemPedido(item.id, quantidade);
    }
  }

  btnDown.onclick = function() {
    const quantidade = parseInt(input.value) - 1;
    if (quantidade >= 0){
      alterarItemPedido(item.id, quantidade);
    }
  }

  btnUp.onclick = function() {
    const quantidade = parseInt(input.value) + 1;
    if (quantidade >= 0){
      alterarItemPedido(item.id, quantidade);
    }
  }

  const td = criarElemento('td')
            .incluirFilho(btnDown)
            .incluirFilho(input)
            .incluirFilho(btnUp)
            .adicionarClasse('seletores')
            .adicionarClasse('alinhaNoCentro');

  linha.incluirFilho(td)
       .adicionarClasse('alinhaNoCentro');

  linha.incluirFilho(criarElemento('td')
      .adicionarClasse('alinhaADireita')
      .adicionarTexto(converterParaRealComCifrao(item.preco)));

  linha.incluirFilho(criarElemento('td')
      .adicionarClasse('alinhaADireita')
      .adicionarTexto(converterParaRealComCifrao(valor)));

  return linha;
}