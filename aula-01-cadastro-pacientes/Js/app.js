ls
// =============================================
// ARRAY DE PACIENTES
// =============================================

// Recupera os pacientes salvos no localStorage.
// Se não existir nenhum, começa com um array vazio.
const pacientes = JSON.parse(
  localStorage.getItem('pacientes')
) || [];


// =============================================
// REFERÊNCIAS DO HTML
// =============================================

const formulario =
  document.getElementById('form-paciente');

const tabela =
  document.getElementById('tabela-pacientes');

const contador =
  document.getElementById('contador-pacientes');

const busca =
  document.getElementById('busca');

const ordenarNome =
  document.getElementById('ordenar-nome');


// =============================================
// CONTROLE DA ORDENAÇÃO
// =============================================

// true = A → Z
// false = Z → A
let ordemCrescente = true;


// =============================================
// SALVAR PACIENTES
// =============================================

function salvarPacientes() {

  localStorage.setItem(
    'pacientes',
    JSON.stringify(pacientes)
  );

}


// =============================================
// ADICIONAR PACIENTE
// =============================================

function adicionarPaciente(
  nome,
  email,
  telefone,
  nascimento
) {

  const novoPaciente = {

    nome: nome,

    email: email,

    telefone: telefone,

    nascimento: nascimento

  };


  pacientes.push(novoPaciente);


  // Salva no localStorage
  salvarPacientes();

}


// =============================================
// CALCULAR IDADE
// =============================================

function calcularIdade(dataNascimento) {

  const hoje = new Date();

  const nascimento = new Date(dataNascimento);


  let idade =
    hoje.getFullYear() -
    nascimento.getFullYear();


  const mesAtual =
    hoje.getMonth();

  const mesNascimento =
    nascimento.getMonth();


  // Verifica se já fez aniversário
  // neste ano.

  if (
    mesAtual < mesNascimento ||
    (
      mesAtual === mesNascimento &&
      hoje.getDate() < nascimento.getDate()
    )
  ) {

    idade--;

  }


  return idade;

}


// =============================================
// FORMATAR DATA
// =============================================

function formatarData(dataISO) {

  const partes =
    dataISO.split('-');


  const ano = partes[0];

  const mes = partes[1];

  const dia = partes[2];


  return `${dia}/${mes}/${ano}`;

}


// =============================================
// RENDERIZAR TABELA
// =============================================

function renderizarTabela(lista = pacientes) {

  // Limpa a tabela
  tabela.innerHTML = '';


  // Percorre os pacientes
  lista.forEach((paciente) => {

    // Descobre o índice original
    // dentro do array pacientes.
    const indice =
      pacientes.indexOf(paciente);


    // Cria uma nova linha
    const linha =
      document.createElement('tr');


    // Coloca os dados dentro da linha
    linha.innerHTML = `

      <td>
        ${paciente.nome}
      </td>

      <td>
        ${paciente.email}
      </td>

      <td>
        ${paciente.telefone}
      </td>

      <td>
        ${formatarData(paciente.nascimento)}
      </td>

      <td>
        ${calcularIdade(paciente.nascimento)} anos
      </td>

      <td>

        <button
          class="btn btn-danger btn-sm"
          onclick="removerPaciente(${indice})"
        >
          Remover
        </button>

      </td>

    `;


    // Adiciona a linha na tabela
    tabela.appendChild(linha);

  });


  // Atualiza o contador
  contador.textContent =
    pacientes.length;

}


// =============================================
// REMOVER PACIENTE
// =============================================

function removerPaciente(indice) {

  // Pergunta antes de remover
  const confirmar =
    confirm(
      'Deseja realmente remover este paciente?'
    );


  // Se clicar em Cancelar
  if (!confirmar) {

    return;

  }


  // Remove o paciente do array
  pacientes.splice(indice, 1);


  // Atualiza o localStorage
  salvarPacientes();


  // Atualiza a tabela
  renderizarTabela();

}


// =============================================
// FORMULÁRIO
// =============================================

formulario.addEventListener(
  'submit',
  function (event) {

    // Impede a página de recarregar
    event.preventDefault();


    // =========================================
    // PEGAR VALORES DOS CAMPOS
    // =========================================

    const nome =
      document.getElementById('nome').value.trim();


    const email =
      document.getElementById('email').value.trim();


    const telefone =
      document.getElementById('telefone').value.trim();


    const nascimento =
      document.getElementById('nascimento').value;



    // =========================================
    // VERIFICAR E-MAIL DUPLICADO
    // =========================================

    const emailJaExiste =
      pacientes.some(
        function (paciente) {

          return paciente.email.toLowerCase()
            === email.toLowerCase();

        }
      );


    // Se já existir
    if (emailJaExiste) {

      alert(
        'Este e-mail já está cadastrado!'
      );

      return;

    }



    // =========================================
    // ADICIONAR PACIENTE
    // =========================================

    adicionarPaciente(
      nome,
      email,
      telefone,
      nascimento
    );



    // =========================================
    // ATUALIZAR TABELA
    // =========================================

    renderizarTabela();



    // =========================================
    // LIMPAR FORMULÁRIO
    // =========================================

    formulario.reset();

  }
);


// =============================================
// BUSCA EM TEMPO REAL
// =============================================

busca.addEventListener(
  'input',
  function () {

    // Pega o que foi digitado
    const texto =
      busca.value.toLowerCase();


    // Filtra os pacientes
    const pacientesFiltrados =
      pacientes.filter(
        function (paciente) {

          return paciente.nome
            .toLowerCase()
            .includes(texto);

        }
      );


    // Mostra os resultados
    renderizarTabela(
      pacientesFiltrados
    );

  }
);


// =============================================
// ORDENAR POR NOME
// =============================================

ordenarNome.addEventListener(
  'click',
  function () {

    pacientes.sort(
      function (a, b) {

        const nomeA =
          a.nome.toLowerCase();

        const nomeB =
          b.nome.toLowerCase();


        // A → Z
        if (nomeA < nomeB) {

          return ordemCrescente
            ? -1
            : 1;

        }


        // Z → A
        if (nomeA > nomeB) {

          return ordemCrescente
            ? 1
            : -1;

        }


        // Nomes iguais
        return 0;

      }
    );


    // Inverte a próxima ordem
    ordemCrescente =
      !ordemCrescente;


    // Salva a nova ordem
    salvarPacientes();


    // Atualiza a tabela
    renderizarTabela();

  }
);


// =============================================
// CARREGAR PACIENTES
// =============================================

// Executado quando a página abre
renderizarTabela();