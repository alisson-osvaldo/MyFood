// Imports e exports
import {
  carregarHtml,
  criarElemento
} from '../util.js'

export {
  abrirListagemDeCategorias
}

// Listagem de categorias
async function abrirListagemDeCategorias() {
  await carregarHtml("categorias/listar", "#categorias");
  document.querySelector('#categorias > div > a').onclick = async e =>{
    e.preventDefault();
    await carregarHtml('categorias/criar', '#categorias');

    const btnSalvar = document.querySelector("#btnSalvar");
    btnSalvar.addEventListener('click', () => {

      const form = document.forms.categorias;
      const jsonData = JSON.stringify({
        nome: form.nome.value,
        descricao: form.descricao.value
      });

      const header = { 
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: jsonData
      };

      fetch('http://localhost:8000/categorias', header)
        .then(() => {
          abrirListagemDeCategorias();
        });
    });

    const btnCancelar = document.querySelector("#btnCancelar");
    btnCancelar.addEventListener('click', () => {
      abrirListagemDeCategorias();
    });
  }

  fetch('http://localhost:8000/categorias')
  .then(response => response.json())
  .then(json => {
    json.forEach( categoria => {
      const linha = criarLinhaCategoria(categoria);
      const tbody = document.querySelector('table.categorias > tbody');
      tbody.appendChild(linha);
    })  
  });
}

// Cria linhas da tabela categoria.
function criarLinhaCategoria(categoria){
  const linha = criarElemento('tr');
  linha.incluirFilho(criarElemento('td').adicionarTexto(categoria.id));
  linha.incluirFilho(criarElemento('td').adicionarTexto(categoria.nome));
  linha.incluirFilho(criarElemento('td').adicionarTexto(categoria.descricao));
  criarActions(linha, "categorias", categoria.id);
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
    editarCategorias(id);
  }
  td.incluirFilho(linkEditar)
  linha.incluirFilho(td)

  const linkExcluir = criarElemento('a');
  linkExcluir.adicionarTexto('Excluir');
  linkExcluir.href = path + '/' + id;
  linkExcluir.onclick = async e => {
    e.preventDefault();
    excluirCategorias(id);
  }
  td.incluirFilho(linkExcluir)
  linha.incluirFilho(td)
}

async function editarCategorias(id) {
  await carregarHtml('categorias/editar', '#categorias');
  const form = document.forms.categorias;
  fetch('http://localhost:8000/categorias/' + id)
  .then(response => response.json())
  .then(categoria => {
    form.id.value = categoria.id;
    form.nome.value = categoria.nome;
    form.descricao.value = categoria.descricao;
  });

  btnSalvar.addEventListener('click', () => {
    const form = document.forms.categorias;
    const jsonData = JSON.stringify({
      id: form.id.value, 
      nome: form.nome.value,
      descricao: form.descricao.value
    });

    const header = { 
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: jsonData
    };
    
    fetch('http://localhost:8000/categorias/' + id, header)
      .then(() => {
        abrirListagemDeCategorias();
      });
  });

  const btnCancelar = document.querySelector("#btnCancelar");
  btnCancelar.addEventListener('click', () => {
    abrirListagemDeCategorias();
  });
}

async function excluirCategorias(id) {
  await carregarHtml('categorias/excluir', '#categorias');
  const form = document.forms.categorias;
  fetch('http://localhost:8000/categorias/' + id)
  .then(response => response.json())
  .then(categoria => {
    form.id.value = categoria.id;
    form.nome.value = categoria.nome;
  });

  const btnConfimar = document.querySelector("#btnConfimar");
  btnConfimar.addEventListener('click', () => {
    fetch('http://localhost:8000/categorias/' + id, { method: 'DELETE'})
      .then(() => {
        abrirListagemDeCategorias();
      });
  });

  const btnCancelar = document.querySelector("#btnCancelar");
  btnCancelar.addEventListener('click', () => {
    abrirListagemDeCategorias();
  }); 
}