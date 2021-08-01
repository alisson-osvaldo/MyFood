export {
  adicionarAoCarrinho,
  carregarItensDoCarrinho,
  mostrarTotalDeItensNoCarrinho,
  removerDoCarrinho,
  carregarHtml,
  criarElemento,
  bindFunctions,
  converterParaRealComCifrao,
  converterRealParaFloat,
  converterParaReal,
  getHojeEmYYYYMMDD,
  getDataEmDDMMYYYY,
  limparCarrinho,
  formatarCPF,
  isEmpty
}

// Formata em moeda real com cifrão.
function converterParaRealComCifrao(valor){
  return valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
}

// Formata em moeda real sem cifrão.
function converterParaReal(valor){
  return valor.toLocaleString('pt-br', {minimumFractionDigits: 2});

}

// Formata CPF (1234567890123)
function formatarCPF(cpf){
  //retira os caracteres indesejados...
  cpf = cpf.replace(/[^\d]/g, "");

  //realiza a formatação...
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function getHojeEmYYYYMMDD(){
  var hoje = new Date(),
      ano = String(hoje.getFullYear()),
      mes = String(hoje.getMonth() + 1),
      dia = String(hoje.getDate());
  if (mes.length < 2) 
      mes = '0' + mes;
  if (dia.length < 2) 
      dia = '0' + dia;
  return [ano, mes, dia].join('-');
}

function getDataEmDDMMYYYY(dataEntrada){
  var data = new Date(dataEntrada),
      dia = String(data.getDate() + 1),
      mes = String(data.getMonth() + 1),
      ano = String(data.getFullYear());
  if (dia.length < 2) 
      dia = '0' + dia;
  if (mes.length < 2) 
      mes = '0' + mes;
  return [dia, mes, ano].join('/');
}

// Converte a moeda real para float.
function converterRealParaFloat(valor){
  if(valor === ""){
     valor =  0;
  }else{
     valor = valor.replace(".","");
     valor = valor.replace(",",".");
     valor = parseFloat(valor);
  }
  return valor;
}

// Verifica se o objeto está vazio.
function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}

// Carrega itens do carrinho.
function carregarItensDoCarrinho(){
  let itens = {};
  let sessionJson = sessionStorage.getItem("sessionJson")
  if (sessionJson !== null) {
    itens = JSON.parse(sessionJson);
  }
  return itens;
}

// Remove itens do carrinho.
function removerDoCarrinho(idRemovido) {
  let item = {};
  let memoryJson = {};
  let sessionJson = sessionStorage.getItem("sessionJson");
  if (sessionJson !== null) {
    limparCarrinho();
    memoryJson = JSON.parse(sessionJson);
    for (const idSession in memoryJson) {
      if (idSession !== idRemovido) {
          item[idSession] = memoryJson[idSession];
          sessionStorage.setItem("sessionJson", JSON.stringify(item))
      }
    }
  }
  mostrarTotalDeItensNoCarrinho();
}

// Limpa o carrinho.
function limparCarrinho() {
  sessionStorage.removeItem("sessionJson");
  const txtCarrinho = document.querySelector('#menuCarrinho');
  txtCarrinho.innerHTML = "Carrinho";
}

// Mostra o total de itens do carrinho.
function mostrarTotalDeItensNoCarrinho(){
  const txtCarrinho = document.querySelector('#menuCarrinho');
  let total = 0;

  let sessionJson = sessionStorage.getItem("sessionJson");
  if (sessionJson !== null) {
    let memoryJson = JSON.parse(sessionJson);
    for(let id in memoryJson){
      total += memoryJson[id];
    }
    if (total > 0) {
      txtCarrinho.innerHTML = "Carrinho <span style='color:red'>(" + total + ") </span>";
    } else {
      txtCarrinho.innerHTML = "Carrinho";
    }
  }
}

// Adiciona itens no carrinho.
function adicionarAoCarrinho(idRecebido, qtdeAtual) {
  let qtde = 0;
  let memoryJson = {};
  let sessionJson = sessionStorage.getItem("sessionJson");
  if (sessionJson === null) {
    qtde = 1;
    memoryJson[idRecebido] = qtde;
    sessionStorage.setItem("sessionJson", JSON.stringify(memoryJson));
  } else {
    memoryJson = JSON.parse(sessionJson);
    let item = memoryJson[idRecebido];
    if (item === null || typeof item === 'undefined') {
      qtde = 1;
      memoryJson[idRecebido] = qtde;
      sessionStorage.setItem("sessionJson", JSON.stringify(memoryJson));
    } else if (qtdeAtual > 0) {
      memoryJson[idRecebido] = qtdeAtual;
      sessionStorage.setItem("sessionJson", JSON.stringify(memoryJson));
    } else {
      qtde = parseInt(item) + 1;
      memoryJson[idRecebido] = qtde;
      sessionStorage.setItem("sessionJson", JSON.stringify(memoryJson));
    }
  }
  mostrarTotalDeItensNoCarrinho();
}

// Carrega conteúdo html via AJAX.
async function carregarHtml(path, seletor){
  const url = 'html/' + path + '.html';
  await fetch(url)
    .then(res => res.text())
    .then(texto => {
        const tag = document.querySelector(seletor);
        tag.innerHTML = texto;
      }
    );
}

// Cria um objeto html.
function criarElemento(tipo){
  const elemento = document.createElement(tipo);
  bindFunctions(elemento);
  return elemento;
}

// Vincula funções ao elemento;.
function bindFunctions(elemento){
  elemento.incluirFilho = incluirFilho;
  elemento.adicionarClasse = adicionarClasse;
  elemento.adicionarTexto = adicionarTexto;
  return elemento;
}

function incluirFilho(filho){
  this.appendChild(filho)
  return this;
}

function adicionarClasse(classe){
  this.classList.add(classe)
  return this;
}

function adicionarTexto(texto){
  this.innerHTML = texto
  return this;
}