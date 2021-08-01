// Imports e exports
import {
  carregarHtml
} from '../util.js'

export {
  abrirClienteLogado
}

// Listagem de produtos
async function abrirClienteLogado() {
  await carregarHtml("logado/editar", "#logado");

  const selectCliente = document.querySelector("#selectCliente");
  selectCliente.onchange = function(){
    selecionarCliente(this.value);
  }

  fetch('http://localhost:8000/clientelogado') 
  .then(res => res.json())
  .then(clienteLogado => {
    if (typeof clienteLogado !== undefined) {
      const form = document.forms.logado;
      form.idOriginal.value = parseInt(clienteLogado.id);
      popularFormCliente(form, clienteLogado)
    }
    fetch('http://localhost:8000/clientes') 
      .then(res => res.json())
      .then(clientes => {
        const selectPratoDoDia = document.querySelector("#selectCliente");
        clientes.forEach(cliente => {
          const option = document.createElement('option');
          option.value = parseInt(cliente.id);
          option.innerHTML = cliente.nome;
          if (clienteLogado.id === parseInt(cliente.id)) {
            option.selected = true;
          }
          selectPratoDoDia.appendChild(option);
        });
        }
      );
  });

  const btnConfirmar = document.querySelector("#frmLogado > input#btnConfirmar");
  btnConfirmar.addEventListener('click', () => {
    const form = document.forms.logado;
    if (parseInt(form.idOriginal.value) !== parseInt(form.id.value)) {
      salvarLogado();
    }    
  });
}

function salvarLogado() {
  const form = document.forms.logado;
  let url = 'http://localhost:8000/clientelogado';
  const header = { 
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: popularJsonLogado()
  };

  fetch(url, header).then(() => {
    alert('Cliente logado alterado!');
  });
}

function selecionarCliente(id) {
  const form = document.forms.logado;
  fetch('http://localhost:8000/clientes/' + id)
  .then(response => response.json())
  .then(clienteLogado => {
    popularFormCliente(form, clienteLogado);
  });
}

function popularFormCliente(form, cliente) {
  form.id.value = parseInt(cliente.id);
  form.login.value = cliente.login;
  form.email.value = cliente.email;
  form.nome.value = cliente.nome;
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

function popularJsonLogado() {
  const form = document.forms.logado;
  return JSON.stringify({
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
  });
}