// Imports e exports
import {
  carregarHtml,
  criarElemento
} from '../util.js'

export {
  abrirListagemDeStatus
}

// Listagem de status
async function abrirListagemDeStatus() {
  await carregarHtml("status/listar", "#status");
  document.querySelector('#status > div > a').onclick = async e => {
    e.preventDefault();
    await carregarHtml('status/criar', '#status');

    const btnSalvar = document.querySelector("#btnSalvar");
    btnSalvar.addEventListener('click', () => {

      const form = document.forms.status;
      const jsonData = JSON.stringify({
        nome: form.nome.value
      });

      const header = { 
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: jsonData
      };

      fetch('http://localhost:8000/status', header)
        .then(() => {
          abrirListagemDeStatus();
        });
    });

    const btnCancelar = document.querySelector("#btnCancelar");
    btnCancelar.addEventListener('click', () => {
      abrirListagemDeStatus();
    });
  }

  fetch('http://localhost:8000/status')
  .then(response => response.json())
  .then(json => {
    json.forEach( status => {
      const linha = criarLinhaStatus(status);
      const tbody = document.querySelector('table.status > tbody');
      tbody.appendChild(linha);
    })  
  });
}

// Cria linhas da tabela status.
function criarLinhaStatus(status){
  const linha = criarElemento('tr');
  linha.incluirFilho(criarElemento('td').adicionarTexto(status.id));
  linha.incluirFilho(criarElemento('td').adicionarTexto(status.nome));
  criarActions(linha, "status", status.id);
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
    editarStatus(id);
  }
  td.incluirFilho(linkEditar)
  linha.incluirFilho(td)

  const linkExcluir = criarElemento('a');
  linkExcluir.adicionarTexto('Excluir');
  linkExcluir.href = path + '/' + id;
  linkExcluir.onclick = async e => {
    e.preventDefault();
    excluirStatus(id);
  }
  td.incluirFilho(linkExcluir)
  linha.incluirFilho(td)
}

async function editarStatus(id) {
  await carregarHtml('status/editar', '#status');
  const form = document.forms.status;
  fetch('http://localhost:8000/status/' + id)
  .then(response => response.json())
  .then(status => {
    form.id.value = status.id;
    form.nome.value = status.nome;
  });

  const btnSalvar = document.querySelector("#btnSalvar");
  btnSalvar.addEventListener('click', () => {
    const form = document.forms.status;
    const jsonData = JSON.stringify({
      id: form.id.value, 
      nome: form.nome.value
    });

    const header = { 
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: jsonData
    };

    fetch('http://localhost:8000/status/' + id, header)
      .then(() => {
        abrirListagemDeStatus();
      });
  });

  const btnCancelar = document.querySelector("#btnCancelar");
  btnCancelar.addEventListener('click', () => {
    abrirListagemDeStatus();
  });
}

async function excluirStatus(id) {
  await carregarHtml('status/excluir', '#status');
  const form = document.forms.status;
  fetch('http://localhost:8000/status/' + id)
  .then(response => response.json())
  .then(status => {
    form.id.value = status.id;
    form.nome.value = status.nome;
  });

  const btnConfimar = document.querySelector("#btnConfimar");
  btnConfimar.addEventListener('click', () => {
    fetch('http://localhost:8000/status/' + id, { method: 'DELETE'})
      .then(() => {
        abrirListagemDeStatus();
      });
  });

  const btnCancelar = document.querySelector("#btnCancelar");
  btnCancelar.addEventListener('click', () => {
    abrirListagemDeStatus();
  }); 
}