// Imports e exports
import {
  carregarHtml,
  criarElemento,
  converterParaRealComCifrao
} from '../util.js'

export {
  abrirListagemDeProdutos,
  criarLinhaProduto
}

// Listagem de produtos
async function abrirListagemDeProdutos() {
  await carregarHtml("produtos/listar", "#produtos");
  document.querySelector('#produtos > div > a').onclick = async e => {
    e.preventDefault();
    criarNovoProduto();
  }

  fetch('http://localhost:8000/produtos') 
  .then(response => response.json())
  .then(json => {
    json.forEach( produto => {
      const linha = criarLinhaProduto(produto);
      const tbody = document.querySelector('table.produtos > tbody');
      tbody.appendChild(linha);
    })  
  });
}

async function criarNovoProduto(){
  await carregarHtml('produtos/criar', '#produtos');
  const form = document.forms.produtos;
  form.nomeDaFotoFrm.value = 'semfoto.png';

  fetch('http://localhost:8000/categorias')
  .then(res => res.json())
  .then(categorias => {
    const selectCategoria = document.querySelector("#categoria");
    categorias.forEach(categoria => {
      const option = document.createElement('option');
      option.value = parseInt(categoria.id);
      option.innerHTML = categoria.nome;
      selectCategoria.appendChild(option);
    });
    }
  );

  criarUploadListeners();

  const btnSalvar = document.querySelector("#frmProdutos > input#btnSalvar");
  btnSalvar.addEventListener('click', () => {
    let isNovo = true;
    salvarProduto(isNovo);
  });

  const btnCancelar = document.querySelector("#frmProdutos > input#btnCancelar");
  btnCancelar.addEventListener('click', () => {
    abrirListagemDeProdutos();
  });
}

function criarUploadListeners() {
  const form = document.forms.produtos;
  const btnUpload = document.querySelector('#foto');
  const imgFoto = document.querySelector('#imgFoto');

  btnUpload.onchange = (e) => {
    const [arquivo] = btnUpload.files;
    if (arquivo) {
      imgFoto.src = URL.createObjectURL(arquivo);
      form.nomeDaFotoFrm.value = Date.now() + "_" + arquivo.name;
    }
  };
  imgFoto.addEventListener('click', () => {
    btnUpload.click();
  });
}

function salvarProduto(isNovo) {
  const form = document.forms.produtos;
  const arquivo = form.foto.files[0];

  if (typeof arquivo !== 'undefined') {
    uploadDaImagem(arquivo, form.nomeDaFotoFrm.value);
  } 

  let url = 'http://localhost:8000/produtos/';
  let metodo = 'POST';

  if (!isNovo){
      url += form.id.value;
      metodo = 'PUT';
  } 

  const header = { 
    method: metodo,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: popularJsonProduto()
  };

  fetch(url, header).then(() => {
    abrirListagemDeProdutos();
  });
}

const uploadDaImagem = (arquivo, novoNome) => {
  const formData = new FormData()
  formData.append('arquivo', arquivo, novoNome);
  fetch('/upload', {
    method: 'POST',
    body: formData
  });
}

// Cria linhas da tabela produto.
function criarLinhaProduto(produto){
  const linha = criarElemento('tr');
  linha.incluirFilho(criarElemento('td').adicionarTexto(produto.id));
  linha.incluirFilho(criarElemento('td').adicionarTexto(produto.nome));
  linha.incluirFilho(criarElemento('td').adicionarTexto(produto.descricao));
  const preco = converterParaRealComCifrao(produto.preco);
  linha.incluirFilho(criarElemento('td')
       .adicionarClasse('alinharADireita')
       .adicionarTexto(preco));
  criarActions(linha, "produtos", produto.id);
  return linha;
}

// Cria ações de exclusão e edição.
function criarActions(linha, path, id){
  const td = criarElemento('td');

  const linkEditar = criarElemento('a');
  linkEditar.adicionarTexto('Editar');
  linkEditar.style.display = 'inline-block';
  linkEditar.style.width = '40px';
  linkEditar.href = path + "/" + id;
  linkEditar.onclick = async e => {
    e.preventDefault();
    editarProduto(id);
  }
  td.incluirFilho(linkEditar)
  linha.incluirFilho(td)

  const linkExcluir = criarElemento('a');
  linkExcluir.adicionarTexto('Excluir');
  linkExcluir.href = path + '/' + id;
  linkExcluir.onclick = async e => {
    e.preventDefault();
    excluirProduto(id);
  }
  td.incluirFilho(linkExcluir)
  linha.incluirFilho(td)
}

async function editarProduto(id) {
  await carregarHtml('produtos/editar', '#produtos');
  popularFormProduto(id);
  criarUploadListeners();

  const btnSalvar = document.querySelector("#frmProdutos > input#btnSalvar");
  btnSalvar.addEventListener('click', () => {
    let isNovo = false;
    salvarProduto(isNovo);
  });

  const btnCancelar = document.querySelector("#frmProdutos > input#btnCancelar");
  btnCancelar.addEventListener('click', () => {
    abrirListagemDeProdutos();
  });
}

async function excluirProduto(id) {
  await carregarHtml('produtos/excluir', '#produtos');
  popularFormProduto(id);
  const btnConfimar = document.querySelector("#btnConfimar");
  btnConfimar.addEventListener('click', () => {
    fetch('http://localhost:8000/produtos/' + id, { method: 'DELETE'})
      .then(() => {
        abrirListagemDeProdutos();
      });
  });

  const btnCancelar = document.querySelector("#btnCancelar");
  btnCancelar.addEventListener('click', () => {
    abrirListagemDeProdutos();
  });
}

function popularFormProduto(id) {
  const form = document.forms.produtos;
  fetch('http://localhost:8000/produtos/' + id)
  .then(response => response.json())
  .then(produto => {
    form.id.value = parseInt(produto.id);
    form.nome.value = produto.nome;
    form.pontosDasAvaliacoes.value = parseInt(produto.pontosDasAvaliacoes);
    form.totalDeAvaliacoes.value = parseInt(produto.totalDeAvaliacoes);
    form.totalDeCompras.value = parseInt(produto.totalDeCompras);
    form.descricao.value = produto.descricao;
    form.nomeDaFotoFrm.value = produto.foto;
    form.imgFoto.src = 'img/' + produto.foto,
    fetch('http://localhost:8000/categorias')
      .then(res => res.json())
      .then(categorias => {
        const selectCategoria = document.querySelector("#categoria");
        categorias.forEach(categoria => {
          const option = document.createElement('option');
          option.value = parseInt(categoria.id);
          option.innerHTML = categoria.nome;
          if (categoria.id === parseInt(produto.categoriaId)) {
            option.selected = true;
          }
          selectCategoria.appendChild(option);
        });
      });
    form.categoria.value = produto.categoriaId;
    form.preco.value = parseFloat(produto.preco);
    form.peso.value = parseInt(produto.peso);
    form.desconto.value = parseFloat(produto.desconto);
    form.disponibilidade.value = parseInt(produto.disponibilidade);
    form.ehVegetariano.value = produto.ehVegetariano;
  });
}

function popularJsonProduto() {
  const form = document.forms.produtos;
  const ehVegetariano = form.ehVegetariano.value === 'true' ? true : false;
  return JSON.stringify({
    id: parseInt(form.id.value),
    pontosDasAvaliacoes: parseInt(form.pontosDasAvaliacoes.value),
    totalDeAvaliacoes: parseInt(form.totalDeAvaliacoes.value),
    totalDeCompras: parseInt(form.totalDeCompras.value),
    nome: form.nome.value,
    descricao: form.descricao.value,
    foto: form.nomeDaFotoFrm.value,
    categoriaId: parseInt(form.categoria.value),
    preco: parseFloat(form.preco.value),
    peso: parseFloat(form.peso.value),
    desconto: parseFloat(form.desconto.value),
    disponibilidade: parseInt(form.disponibilidade.value),
    ehVegetariano: ehVegetariano
  });
}