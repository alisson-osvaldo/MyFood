
const main = document.querySelector('main'); //selecionar pela teg main da index

//Requisição AJAX.
function carregarHTML(url){
    fetch(url)
    .then(res => res.text( ))
    .then(html => {
        main.innerHTML = html;
    });
}

function carregarHome( ){
    //carregarHTML( 'html/home.html' ); //await : para aguardar o carregamento da home 
    fetch('html/home.html') //localiza o arquivo 
    .then(res => res.text()) //trazer a resposta no formato text
    .then(html => {
        main.innerHTML = html; 
        fetch('http://localhost:8000/pratododia')
            .then(res => res.json( )) //recebendo json pratoDoDia
            .then(pratoDoDia => { //agora vamos mesclar json com a section que acabamos de criar 
               const imgFoto = document.querySelector("section > img") //pegamos isso da ferramenta do desenvolvedor/copy/copyJS
               imgFoto.src =  "../img/" + pratoDoDia.foto; //caso não ache a img, sai da pasta script e junta + pratoDoDia.foto
               const h1Nome = document.querySelector("section > div > h1")
               h1Nome.innerHTML = pratoDoDia.nome;
               const pDescricao = document.querySelector("section > div > p")
               pDescricao.innerHTML = pratoDoDia.descricao;
        });
      /*  {
            "id": 1,
            "pontosDasAvaliacoes": 4,
            "totalDeAvaliacoes": 350,
            "totalDeCompras": 0,
            "nome": "Acompanhamentos",
            "descricao": "Manteiga, nata, mel, requeijão salgado, queijo branco.",
            "foto": "cafe1.jpg",
            "categoriaId": 1,
            "preco": 27.56,
            "peso": 160,
            "desconto": 0,
            "disponibilidade": 5,
            "ehVegetariano": false
          }*/

    }); //pegar a resposta e carregar na pag index
}
carregarHome( );


/*  FOI PEGO DA CARDAPIO.HTML
    <div class="card-prato">
  <span class="card-titulo">Acompanhamentos</span>
  <img src="./img/cafe1.jpg">
  <div class="card-conteudo">
    <span class="card-preco">R$&nbsp;27,56</span>
    <span class="card-texto">Manteiga, nata, mel, requeijão salgado, queijo branco.</span>
    <button class="card-texto">Adicionar ao carrinho</button>
  </div>*/

/* PEGO DO BD PARA USAR COMO BASE 
  "id": 3,
  "nome": "Croque Madame",
  "descricao": "Pão torrado, salame de vitela, ovos, manteiga, queijo, rúcula, cenoura, pepino, rabanete.",
  "preco": 35.1,
  "peso": 125,
  "foto": "cafe3.jpg",
  "desconto": 0,
  "pontosDasAvaliacoes": 4,
  "totalDeAvaliacoes": 370,
  "disponibilidade": 5,
  "totalDeCompras": 0,
  "ehVegetariano": false,
  "categoriaId": 1*/

function criarCard(produto) { //vou receber produto
    //card
    const divPrato = document.createElement('div');
    divPrato.classList.add('card-prato');//('card-prato') classe do CSS q vai ser aplicado nele 
    const spanTitulo = document.createElement('span');
    spanTitulo.classList.add('card-titulo');
    spanTitulo.innerHTML = produto.nome;

    const imgFoto = document.createElement('img');
    imgFoto.src = "../img/" + produto.foto;

    const divConteudo = document.createElement('div');
    divConteudo.classList.add('card-conteudo');
    const spanPreco = document.createElement('span');
    spanPreco.classList.add('card-preco');
    spanPreco.innerHTML = produto.preco;

    const spanTexto = document.createElement('span');
    spanTexto.classList.add('card-texto');
    spanTexto.innerHTML = produto.descricao;

    const btnAdicionar = document.createElement('button');
    btnAdicionar.classList.add('card-texto')
    btnAdicionar.innerHTML = "Adicionar ao carrinho" ;
    btnAdicionar.onclick = function(e){
        alert("Programar a função do botão!");
    }

    divConteudo.appendChild(spanPreco);
    divConteudo.appendChild(spanTexto);
    divConteudo.appendChild(btnAdicionar);

    divPrato.appendChild(spanTitulo);
  divPrato.appendChild(imgFoto);
  divPrato.appendChild(divConteudo);
  return divPrato;
}

function carregarCardapio( ){
    fetch('html/cardapio.html') 
    .then(res => res.text()) 
    .then(html => {
        main.innerHTML = html; 
        const section = document.querySelector('section');
        fetch('http://localhost:8000/produtos')
            .then(res => res.json( ))
            .then(produtos => { 
                produtos.forEach(produto =>{ //para cada produto que eu tenho no array do bd eu quero criar um card
                    const card = criarCard(produto); //ele vai me retornar um card criado
                    section.appendChild(card);//vou na minha section e adiciono o card
                });
        });
    });     
}

/*
function carregarHome( ){
    fetch('html/home.html') //localiza o arquivo 
        .then(res => res.text()) //trazer a resposta no formato text
        .then(html => {
            main.innerHTML = html; 
        }); //pegar a resposta e carregar na pag index
    }


function carregarCarrinho( ){
    fetch('html/carrinho.html') //localiza o arquivo 
        .then(res => res.text()) //trazer a resposta no formato text
        .then(html => {
            main.innerHTML = html; 
        }); //pegar a resposta e carregar na pag index
}
*/

/*<div>
    <form name="status" action="/#" method="post">
      <input id="id" name="id" type="hidden" >
      <div>
        <label for="nome">Nome</label>
        <input id="nome" name="nome" type="text">
      </div>
      <label></label>
      <input id="btnSalvar" type="button" value="Salvar">
      <input id="btnCancelar" type="button" value="Cancelar">
    </form>
  </div>*/
function editarStatus(id) {
    //http://localhost:8000/status/3
    fetch('html/status/status_editar.html') 
    .then(res => res.text()) 
    .then(html => {
        main.innerHTML = html; 

    fetch('http://localhost:8000/status/' + id)
    .then(res => res.json( ))
    .then(status => { 
    const inputId = document.forms.status.id; //para traser o id do que será editado
    inputId.value = status.id;
    const inputNome = document.forms.status.nome;
    inputNome.value = status.nome;
    const btnSalvar = document.getElementById('btnSalvar');
    btnSalvar.onclick = function(e){
        e.preventDefault( );
        alert('Vai salvar...');
    }
    const btnCancelar = document.getElementById('btnCancelar');
    btnCancelar.onclick = function(e){
        e.preventDefault( );
        carregarListaDeStatus( );
            }
        });
    });
}

function criarLinhaDeStatus(status){
    /*<td>1</td>
    <td>Em processamento</td>
    <td>
        <a href="../../status_editar.html" style="display: inline-block; width: 40px;">Editar</a>
        <a href="../../status_excluir.html">Excluir</a>
    </td>*/
    const trLinha = document.createElement('tr');
    const tdId = document.createElement('td');
    tdId.innerHTML = status.id;
    const tdNome = document.createElement('td');
    tdNome.innerHTML = status.nome;
    const tdAcoes = document.createElement('td');
    const aEditar = document.createElement('a');
    aEditar.href = ' '; //para mostrar ele como um icone
    aEditar.style.display = 'inline-block' ;
    aEditar.style.width = '40px' ;
    aEditar.onclick = function(e) {
        e.preventDefault( );
        editarStatus( status.id);
    }
    aEditar.innerHTML = 'Editar' ;

    const aExcluir = document.createElement('a');
    aExcluir.href = ' ';
    aExcluir.onclick = function(e) {
        e.preventDefault( );
        alert('Vai excluir. . . ');
    }
    aExcluir.innerHTML = 'Excluir' ;

    tdAcoes.appendChild(aEditar);
    tdAcoes.appendChild(aExcluir);

    trLinha.appendChild(tdId);
    trLinha.appendChild(tdNome);
    trLinha.appendChild(tdAcoes);

    return trLinha;
}

function carregarCadastros( ){
    fetch('html/cadastros.html') //localiza o arquivo 
        .then(res => res.text()) //trazer a resposta no formato text
        .then(html => {
            main.innerHTML = html; 
            const btnListarProdutos = document.querySelector( '#btnListarProdutos' );
            btnListarProdutos.onclick = function(e){
                e.preventDefault( ); //para desativar as funções básicas
                alert('Clieque em Listar Produtos');
            }
            const btnListarClientes = document.querySelector( '#btnListarClientes' );
            btnListarClientes.onclick = function(e){
                e.preventDefault( ); //para desativar as funções básicas
                alert('Clieque em Listar Clientes');
            }
            const btnListarPedidos = document.querySelector( '#btnListarPedidos' );
            btnListarPedidos.onclick = function(e){
                e.preventDefault( ); //para desativar as funções básicas
                alert('Clieque em Listar Pedidos');
            }
            const btnListarCategorias = document.querySelector( '#btnListarCategorias' );
            btnListarCategorias.onclick = function(e){
                e.preventDefault( ); //para desativar as funções básicas
                alert('Clieque em Listar Categorias');
            }
            const btnListarStatus = document.querySelector( '#btnListarStatus' );
            btnListarStatus.onclick = function(e){
                e.preventDefault( ); //para desativar as funções básicas
                carregarListaDeStatus( );
            }

            function carregarListaDeStatus( ){
                fetch('html/status/status_listar.html') 
                .then(res => res.text()) 
                .then(html => {
                    main.innerHTML = html; 
                    const tbody = document.querySelector("#status > table > tbody");
                fetch('http://localhost:8000/status') //para retornar os status do BD
                .then(res => res.json( ))
                .then(listaDeStatus => { 
                    listaDeStatus.forEach(status =>{ //para cada produto que eu tenho no array do bd eu quero criar um card
                        const linhaDeStatus = criarLinhaDeStatus(status);
                        tbody.appendChild(linhaDeStatus); //acrecentar cada linha de status
                    });
                });
             });
            }

            const btnPratoDoDia = document.querySelector( '#btnPratoDoDia' );
            btnPratoDoDia.onclick = function(e){
                e.preventDefault( ); //para desativar as funções básicas
                alert('Clieque em Listar PratoDoDia');
            }
            const btnLogado = document.querySelector( '#btnLogado' );
            btnLogado.onclick = function(e){
                e.preventDefault( ); //para desativar as funções básicas
                alert('Clieque em Logado');
            }
        /*
    <a style="color: black;text-decoration: none;" id="btnListarProdutos" href=  >Produtos</a>
    <a style="color: black;text-decoration: none;" id="btnListarClientes" href=  >Clientes</a>
    <a style="color: black;text-decoration: none;" id="btnListarPedidos" href=  >Pedidos</a>
    <a style="color: black;text-decoration: none;" id="btnListarCategorias" href=  >Categorias</a>
    <a style="color: black;text-decoration: none;" id="btnListarStatus" href=  >Status</a>
    <a style="color: black;text-decoration: none;" id="btnListarPratoDoDia" href=  >Prato do dia</a>
    <a style="color: black;text-decoration: none;" id="btnListarLogado" href=  >Logado</a>
*/
        }); //pegar a resposta e carregar na pag index
}
/*
function carregarSobre( ){
    fetch('html/sobre.html') //localiza o arquivo 
        .then(res => res.text()) //trazer a resposta no formato text
        .then(html => {
            main.innerHTML = html; 
        }); //pegar a resposta e carregar na pag index
}
*/

//Eventos (onclick)
const mnHome = document.querySelector('#menuHome');
mnHome.onclick = function( e ){ 
    e.preventDefault(); //cancelando o onclick padrão do href
    carregarHTML( 'html/home.html' );
}
const mnCardapio = document.querySelector('#menuCardapio');
mnCardapio.onclick = function( e ){ 
    e.preventDefault( ); //cancelando o onclick padrão do href
    carregarCardapio();
}
const mnCarrinho = document.querySelector('#menuCarrinho');
mnCarrinho.onclick = function( e ){ 
    e.preventDefault(); //cancelando o onclick padrão do href
    carregarHTML( 'html/carrinho.html' );
}
const mnCadastro = document.querySelector('#menuCadastro');
mnCadastro.onclick = function( e ){ 
    e.preventDefault( ); //cancelando o onclick padrão do href
    carregarCadastros( );
}
const mnSobre = document.querySelector('#menuSobre');
mnSobre.onclick = function( e ){ 
    e.preventDefault(); //cancelando o onclick padrão do href
    carregarHTML( 'html/sobre.html' );
}



