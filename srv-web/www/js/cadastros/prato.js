// Imports e exports
import {
  carregarHtml
} from '../util.js'

export {
  abrirPratoDoDia
}

// Listagem de produtos
async function abrirPratoDoDia() {
  await carregarHtml("pratododia/editar", "#pratoDoDia");

  const selectPrato = document.querySelector("#selectPrato");
  selectPrato.onchange = function(){
    selecionarPrato(this.value);
  }

  fetch('http://localhost:8000/pratododia') 
  .then(res => res.json())
  .then(pratoDoDia => {
    if (typeof pratoDoDia !== undefined) {
      const form = document.forms.pratoDoDia;
      form.idOriginal.value = parseInt(pratoDoDia.id);
      popularFormPrato(form, pratoDoDia)
    }
    fetch('http://localhost:8000/produtos') 
      .then(res => res.json())
      .then(pratos => {
        const selectPratoDoDia = document.querySelector("#selectPrato");
        pratos.forEach(prato => {
          const option = document.createElement('option');
          option.value = parseInt(prato.id);
          option.innerHTML = prato.nome;
          if (pratoDoDia.id === parseInt(prato.id)) {
            option.selected = true;
          }
          selectPratoDoDia.appendChild(option);
        });
        }
      );
  });

  const btnConfirmar = document.querySelector("#frmPratoDoDia > input#btnConfirmar");
  btnConfirmar.addEventListener('click', () => {
    const form = document.forms.pratoDoDia;
    if (parseInt(form.idOriginal.value) !== parseInt(form.id.value)) {
      salvarPrato();
    }    
  });
}

function salvarPrato() {
  const form = document.forms.pratoDoDia;
  let url = 'http://localhost:8000/pratododia';
  const header = { 
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: popularJsonPrato()
  };

  fetch(url, header).then(() => {
    alert('Prato do dia alterado!');
  });
}

function selecionarPrato(id) {
  const form = document.forms.pratoDoDia;
  fetch('http://localhost:8000/produtos/' + id)
  .then(response => response.json())
  .then(pratoDoDia => {
    popularFormPrato(form, pratoDoDia);
  });
}

function popularFormPrato(form, pratoDoDia) {
  form.id.value = parseInt(pratoDoDia.id);
  form.nome.value = pratoDoDia.nome;
  form.pontosDasAvaliacoes.value = parseInt(pratoDoDia.pontosDasAvaliacoes);
  form.totalDeAvaliacoes.value = parseInt(pratoDoDia.totalDeAvaliacoes);
  form.totalDeCompras.value = parseInt(pratoDoDia.totalDeCompras);
  form.descricao.value = pratoDoDia.descricao;
  form.foto.value = pratoDoDia.foto,
  form.imgFoto.src = 'img/' + pratoDoDia.foto,
  form.categoriaId.value = pratoDoDia.categoriaId;
  form.preco.value = parseFloat(pratoDoDia.preco);
  form.peso.value = parseInt(pratoDoDia.peso);
  form.desconto.value = parseFloat(pratoDoDia.desconto);
  form.disponibilidade.value = parseInt(pratoDoDia.disponibilidade);
  form.ehVegetariano.value = pratoDoDia.ehVegetariano;
}

function popularJsonPrato() {
  const form = document.forms.pratoDoDia;
  const ehVegetariano = form.ehVegetariano.value === 'true' ? true : false;
  return JSON.stringify({
    id: parseInt(form.id.value),
    pontosDasAvaliacoes: parseInt(form.pontosDasAvaliacoes.value),
    totalDeAvaliacoes: parseInt(form.totalDeAvaliacoes.value),
    totalDeCompras: parseInt(form.totalDeCompras.value),
    nome: form.nome.value,
    descricao: form.descricao.value,
    foto: form.foto.value,
    categoriaId: parseInt(form.categoriaId.value),
    preco: parseFloat(form.preco.value),
    peso: parseFloat(form.peso.value),
    desconto: parseFloat(form.desconto.value),
    disponibilidade: parseInt(form.disponibilidade.value),
    ehVegetariano: ehVegetariano
  });
}