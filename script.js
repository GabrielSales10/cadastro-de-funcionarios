const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sFuncao = document.querySelector('#m-funcao')
const sSalario = document.querySelector('#m-salario')
const btnSalvar = document.querySelector('#btnSalvar')

/*inicializadas com o valor 'undefined' por padrão*/ 
let itens
let id

/* nao é uma operação de edição*/
function openModal(edit = false, index = 0) {
  /* add a classe CSS 'active' ao elemento modal */
  modal.classList.add('active')

  modal.onclick = e => {
    /*e.target: Isso se refere ao elemento que foi clicado durante o evento de clique. */
    /*e.target.className: Isso retorna uma string contendo todas as classes CSS do elemento clicado. */
    /*.indexOf('modal-container'): Isso verifica se a string contém a classe CSS 'modal-container'. 
    O método indexOf retorna a posição em que a substring é encontrada na string, ou -1 se a substring não for encontrada. */
    /*!== -1: Isso verifica se a classe 'modal-container' foi encontrada na string de classes CSS. Se for encontrado, 
    o resultado da comparação será true, caso contrário, será false. */
    if (e.target.className.indexOf('modal-container') !== -1) {
      /*/*modal.classList.remove('active'): Se a classe 'modal-container' for encontrada na string de classes CSS do elemento clicado,
      a classe 'active' é removida do elemento modal. Isso significa que a janela modal será fechada. */ 
      modal.classList.remove('active')
    }
  }

  /*Verifica se o parâmetro edit é true, ou seja, se o modo de edição está ativado. */
  if (edit) {
    /*Se o modo de edição estiver ativado, define o valor do campo de entrada sNome com o 
    valor do nome do item correspondente no array itens, usando o índice fornecido como parâmetro */
    sNome.value = itens[index].nome
    /*Se o modo de edição estiver ativado, define o valor do campo de entrada sFuncao com o valor da 
    função do item correspondente no array itens, usando o índice fornecido como parâmetro. */
    sFuncao.value = itens[index].funcao
    /* Se o modo de edição estiver ativado, define o valor do campo de entrada sSalario com o valor 
    do salário do item correspondente no array itens, usando o índice fornecido como parâmetro.*/
    sSalario.value = itens[index].salario
    /*Se o modo de edição estiver ativado, atribui o índice fornecido à variável id, 
    que é usada posteriormente para identificar o item sendo editado. */
    id = index
    /*Se o modo de edição não estiver ativado, ou seja, edit é false, os campos de entrada são limpos,
     definindo seus valores como strings vazias (''). */
  } else {
    sNome.value = ''
    sFuncao.value = ''
    sSalario.value = ''
  }
  
}

/* index: É o parâmetro que indica o índice do item a ser editado.*/
function editItem(index) {
  /*O argumento true indica que o modo de edição está ativado, 
  e o argumento index é o índice do item a ser editado. */
  openModal(true, index)
}

function deleteItem(index) {
  /*'splice' remove um elemento do array 'itens' */
  /*'index' é o indice do elemento a ser removido e '1' é a quantidade de elementos a serem removidos*/
  itens.splice(index, 1)
  /*atualiza o array */
  setItensBD()
  /*carrega os itens na interface */
  loadItens()
}

/*inserir um novo item na tabela da interface */
/*'item' é o objeto de item contendo as informações como nome, funcao e salario,
 'index' é a posicao do item na lista */
function insertItem(item, index) {
  /*linha da tabela contendo as informações do item */
  let tr = document.createElement('tr')
   /*tr.innerHTML = é responsável por gerar o HTML necessário para exibir
   as informações do item dentro de uma linha da tabela. */
   /*As informações do item são inseridas nas células da tabela usando interpolação de string
   ${} para acessar as propriedades do objeto item como item.nome, item.funcao e item.salario */
  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.funcao}</td>
    <td>R$ ${item.salario}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `
  /*Por fim, a linha tr é anexada ao elemento tbody, que é o corpo da tabela na interface,
   usando tbody.appendChild(tr) para exibir o novo item na tabela. */
  tbody.appendChild(tr)
}

btnSalvar.onclick = e => {
  
  /* Verifica se algum dos campos (sNome, sFuncao, sSalario) está vazio. 
  Se algum deles estiver vazio, a função retorna sem executar o restante do código.*/
  if (sNome.value == '' || sFuncao.value == '' || sSalario.value == '') {
    return
  }
  /*Usa o método preventDefault() no objeto do evento (e) para cancelar o comportamento padrão do botão de salvar. 
  Isso evita que a página seja recarregada quando o botão é clicado. */
  e.preventDefault();

  /* Verifica se a variável 'id' é definida. Se for, significa que estamos editando um item existente. 
  Nesse caso, atualiza as propriedades 'nome', 'funcao' e 'salario' do item correspondente no array 'itens' 
  com os valores dos campos de entrada (sNome, sFuncao, sSalario).*/
  if (id !== undefined) {
    itens[id].nome = sNome.value
    itens[id].funcao = sFuncao.value
    itens[id].salario = sSalario.value
    /*Caso contrário, significa que estamos adicionando um novo item */
  } else {
    itens.push({'nome': sNome.value, 'funcao': sFuncao.value, 'salario': sSalario.value})
  }

  setItensBD()

  modal.classList.remove('active')
  loadItens()
  /*Define a variável 'id' como 'undefined' para indicar que não estamos mais editando nenhum item. */
  id = undefined
}

/*Chama a função getItensBD() para obter os itens do banco de dados ou armazenamento 
e armazena o resultado na variável itens. */
function loadItens() {
  itens = getItensBD()
  /* Limpa o conteúdo do elemento tbody para remover todos os itens existentes na tabela.*/
  tbody.innerHTML = ''
  /*Itera sobre cada item no array itens usando o método forEach. */
  itens.forEach((item, index) => {
    /*Para cada item, chama a função insertItem(item, index) para inserir 
    uma nova linha na tabela com as informações do item. */
    insertItem(item, index)
  })

}

/*JSON.parse(...): JSON.parse() é uma função do JavaScript usada para converter uma string JSON em um objeto JavaScript. 
Neste caso, ela é usada para converter o valor retornado por localStorage.getItem('dbfunc'), que é uma string JSON, em um objeto JavaScript. */
/*localStorage.getItem('dbfunc'): localStorage é um objeto global do JavaScript que permite o armazenamento persistente de dados no navegador. getItem('dbfunc') 
é um método do objeto localStorage usado para obter o valor associado à chave 'dbfunc'. */
/*?? []: É o operador de coalescência nula (nullish coalescing operator) que verifica se o valor retornado por JSON.parse(localStorage.getItem('dbfunc')) 
é nulo ou indefinido (null ou undefined). Se for, ele retornará um array vazio []. */
const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []
/*localStorage.setItem('dbfunc', JSON.stringify(itens)): localStorage é um objeto global do JavaScript que permite o armazenamento persistente de dados no navegador. setItem('dbfunc', JSON.stringify(itens)) 
é um método do objeto localStorage usado para definir um item no armazenamento local. Ele recebe dois argumentos: a chave 'dbfunc' e o valor a ser armazenado. 
Neste caso, o valor é obtido convertendo o array itens em uma string JSON usando JSON.stringify(). */
/* a função setItensBD recebe o array itens, converte-o em uma string JSON usando JSON.stringify() e, em seguida, armazena essa string no localStorage com a chave 'dbfunc'. 
Dessa forma, os itens são persistidos no armazenamento local do navegador.*/
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens))

/* carregar os itens armazenados no armazenamento local e exibi-los na tabela HTML. */
loadItens()
