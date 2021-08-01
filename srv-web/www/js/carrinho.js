// Imports e exports
import {
  carregarHtml,
  criarElemento,
  carregarItensDoCarrinho,
  converterParaRealComCifrao,
  adicionarAoCarrinho,
  removerDoCarrinho,
  getHojeEmYYYYMMDD,
  limparCarrinho,
  isEmpty
} from './util.js'

export {
  carregarPaginaCarrinho
};

// Inicia a página carrinho.
async function carregarPaginaCarrinho () {
  await carregarHtml('carrinho', 'main');
  fetch('http://localhost:8000/clientelogado') 
  .then(res => res.json())
  .then(clienteLogado => {
    if (typeof clienteLogado !== undefined) {
      popularFormCliente(clienteLogado)
    }
  });
  popularCarrinho();
  const btnConfirmarPedido = document.querySelector('#btnConfirmar');
  btnConfirmarPedido.onclick = function(){
    confirmarPedidoListener();
  }
};

function confirmarPedidoListener(){
  const clienteJson = popularJsonCliente();
    const itensPedido = [];
    const pedidoJson = {
      "data": getHojeEmYYYYMMDD(),
      "itens": [],
      "total": 0,
      "cliente": clienteJson,
      "status": {
        "id": 1,
        "nome": "Em processamento"
      }
    }
    let query = '?';
    let contador = 0;
    const itens = carregarItensDoCarrinho();
    for (const id in itens) {
      if (contador == 0) {
        query += 'id=' + id;
      } else {
        query += '&id=' + id;
      }
      contador++;
    }
    
    fetch('http://localhost:8000/produtos' + query)
      .then(response => response.json())
      .then(json => {
        let vlrTotal = 0;
        json.forEach(produto => {
          produto.quantidade = parseFloat(itens[produto.id]);
          itensPedido.push(produto);
          vlrTotal += parseFloat(itens[produto.id]) * parseFloat(produto.preco);
        });
        pedidoJson.itens = itensPedido;
        pedidoJson.total = parseFloat(vlrTotal.toFixed(2));

        let url = 'http://localhost:8000/pedidos/';
        const header = { 
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(pedidoJson)
        };

        fetch(url, header).then(() => {
          limparTelaCarrinho()
        });
      });
}

async function limparTelaCarrinho(){
  await carregarHtml('pedidos/confirmado', 'main');
  limparCarrinho();
}

function popularJsonCliente() {
  const form = document.forms.logado;
  return {
    id: parseInt(form.id.value),
    login: form.login.value,
    email: form.email.value,
    nome: form.nome.value,
    sobrenome: form.sobrenome.value,
    cpf: form.cpf.value,
    lojaId: parseInt(form.lojaId.value),
    saldoCarteira: parseFloat(form.saldocarteira.value),
    receita: parseFloat(form.receita.value),
    fone: form.fone.value,
    cidade: form.cidade.value,
    estado: form.estado.value,
    cep: form.cep.value,
    endereco: form.endereco.value
  };
}

function popularCarrinho(idAlterado, qtde) {
  let query = '?';
  let contador = 0;
  const itens = carregarItensDoCarrinho();
  const tdVlrTotal = document.querySelector('#vlrTotal');
  const seletor = 'form#frmLogadoCarrinho > div > input#btnConfirmar';
  const btnConfirmar = document.querySelector(seletor);
  if (isEmpty(itens)){
    btnConfirmar.setAttribute('disabled', 'true');
    const tbody = document.querySelector('table#itensCarrinho > tbody');
    tbody.innerHTML = '';
    const divVazio = criarElemento('div');
    divVazio.adicionarClasse('divVazio');
    const spanTexto = criarElemento('span');
    spanTexto.innerHTML = 'Seu carrinho está vazio!';
    divVazio.appendChild(spanTexto);

    const imgTriste = criarElemento('img');
    imgTriste.src = '../img/icone_triste.png';
    divVazio.appendChild(imgTriste);

    const tdVazio = criarElemento('td');
    tdVazio.setAttribute('colspan', '4');
    tdVazio.appendChild(divVazio);
    tbody.appendChild(tdVazio);
    tdVlrTotal.innerHTML = converterParaRealComCifrao(0);
  } else {
    btnConfirmar.removeAttribute('disabled');
    for (const id in itens) {
      if (contador == 0) {
        query += 'id=' + id;
      } else {
        query += '&id=' + id;
      }
      contador++;
    }
    fetch('http://localhost:8000/produtos' + query)
      .then(response => response.json())
      .then(json => {
        let vlrTotal = 0;
        const tbody = document.querySelector('table#itensCarrinho > tbody');
        tbody.innerHTML = '';
        json.forEach(produto => {
          if (idAlterado !== null && 
            typeof idAlterado !== 'undefined' && 
            idAlterado === produto.id){
            if (qtde > 0) {
              vlrTotal += parseFloat(itens[produto.id]) * parseFloat(produto.preco);
              const linha = criarLinhaProduto(produto, itens);
              tbody.appendChild(linha);
            }
          } else {
            vlrTotal += parseFloat(itens[produto.id]) * parseFloat(produto.preco);
            const linha = criarLinhaProduto(produto, itens);
            tbody.appendChild(linha);
          }
        });
        
        tdVlrTotal.innerHTML = converterParaRealComCifrao(vlrTotal);
      });
  }
}

// Cria linhas da tabela produto.
function criarLinhaProduto(produto, itens){

  const valor = parseFloat(itens[produto.id]) * parseFloat(produto.preco);

  const linha = criarElemento('tr');
  linha.incluirFilho(criarElemento('td')
      .adicionarClasse('alinhaAEsquerda')
      .adicionarTexto(produto.nome));

  const btnDown = criarElemento('img')
      .adicionarClasse('btnDown');
  btnDown.src = '../img/btn_down.png';

  const btnUp = criarElemento('img')
      .adicionarClasse('btnUp');
  btnUp.src = '../img/btn_up.png';

  const input = criarElemento('input');
  input.setAttribute("type", "text");
  input.idProduto = produto.id;
  input.qtde = itens[produto.id];
  input.value = itens[produto.id];
  input.onchange = function(){
    const qtde = parseInt(this.value);
    if (qtde > 0) {
      adicionarAoCarrinho(String(produto.id), parseInt(this.value))
    } else {
      removerDoCarrinho(String(produto.id));
    }
    popularCarrinho(this.idProduto, parseInt(this.value));
  }

  btnDown.onclick = function() {
    const qtde = parseInt(input.value) - 1;
    if (qtde > 0) {
      adicionarAoCarrinho(String(produto.id), parseInt(qtde))
    } else {
      removerDoCarrinho(String(produto.id));
    }
    popularCarrinho(this.idProduto, parseInt(this.value));
  }

  btnUp.onclick = function() {
    const qtde = parseInt(input.value) + 1;
    adicionarAoCarrinho(String(produto.id), parseInt(qtde))
    popularCarrinho(this.idProduto, parseInt(this.value));
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
      .adicionarTexto(converterParaRealComCifrao(produto.preco)));

  linha.incluirFilho(criarElemento('td')
      .adicionarClasse('alinhaADireita')
      .adicionarTexto(converterParaRealComCifrao(valor)));

  return linha;
}

function popularFormCliente(cliente) {
  const form = document.forms.logado;
  form.id.value = parseInt(cliente.id);
  form.login.value = cliente.login;
  form.email.value = cliente.email;
  form.nome.value = cliente.nome + " " + cliente.sobrenome;
  form.sobrenome.value = cliente.sobrenome;
  form.cpf.value = cliente.cpf;
  form.lojaId.value = parseInt(cliente.lojaId);
  form.saldocarteira.value = parseFloat(cliente.saldoCarteira);
  form.receita.value = parseFloat(cliente.receita);
  form.fone.value = cliente.fone;
  form.cidade.value = cliente.cidade;
  form.estado.value = cliente.estado;
  form.cep.value = cliente.cep;
  form.endereco.value = cliente.endereco;
}
