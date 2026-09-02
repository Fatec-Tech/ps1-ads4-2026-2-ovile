
// ARRAY DE PACIENTES
// Carrega os pacientes salvos no localStorage.
// Se não existir nenhum paciente salvo, começa com [].
const pacientes = JSON.parse(
  localStorage.getItem('pacientes')
) || [];


// REFERÊNCIAS DO DOM

const formulario = document.getElementById('form-paciente');

const tabela = document.getElementById('tabela-pacientes');

const contador = document.getElementById('contador-pacientes');

const busca = document.getElementById('busca');

const ordenarNome = document.getElementById('ordenar-nome');


// Controla a ordem da lista
let ordemCrescente = true;


// =====================================================
// SALVAR NO LOCALSTORAGE
// =====================================================

function salvarPacientes() {

  localStorage.setItem(
    'pacientes',
    JSON.stringify(pacientes)
  );

}
// Função responsável por adicionar um paciente ao array
function adicionarPaciente(nome, email, nascimento) { 
  const novoPaciente = { nome, email, nascimento };
  pacientes.push(novoPaciente);
  salvarPacientes();
}

// Função responsável por desenhar a tabela inteira a partir do array
function renderizarTabela() {
  tabela.innerHTML = ''; // limpa a tabela antes de redesenhar

  pacientes.forEach((paciente) => {
    const linha = document.createElement('tr');

    linha.innerHTML = `
      <td>${paciente.nome}</td>
      <td>${paciente.email}</td>
      <td>${formatarData(paciente.nascimento)}</td>
    `;

    tabela.appendChild(linha);
  });
}
// =====================================================
// CALCULAR IDADE
// =====================================================

function calcularIdade(dataNascimento) {

  const hoje = new Date();

  const nascimento = new Date(dataNascimento);

  let idade =
    hoje.getFullYear() -
    nascimento.getFullYear();

  const mesAtual = hoje.getMonth();

  const mesNascimento = nascimento.getMonth();


  // Verifica se já fez aniversário este ano
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

// Função utilitária só para formatar a data no padrão dd/mm/aaaa
function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}
// =====================================================
// RENDERIZAR TABELA
// =====================================================

function renderizarTabela(lista = pacientes) {

  // Limpa a tabela
  tabela.innerHTML = '';


  // Percorre a lista que será exibida
  lista.forEach((paciente) => {

    // Descobre o índice ORIGINAL do paciente
    const indice = pacientes.indexOf(paciente);

    const linha =
      document.createElement('tr');


    linha.innerHTML = `

      <td>${paciente.nome}</td>

      <td>${paciente.email}</td>

      <td>${paciente.telefone}</td>

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


    tabela.appendChild(linha);

  });


  // Atualiza contador
  contador.textContent =
    `Total de pacientes: ${lista.length}`;

}


// =====================================================
// REMOVER PACIENTE
// =====================================================

function removerPaciente(indice) {

  // Confirma antes de remover
  const confirmar =
    confirm(
      'Deseja realmente remover este paciente?'
    );


  if (!confirmar) {

    return;

  }


  // Remove 1 elemento usando o índice
  pacientes.splice(indice, 1);


  // Atualiza o localStorage
  salvarPacientes();


  // Atualiza a tabela
  renderizarTabela();

}

// Evento disparado quando o formulário é enviado
formulario.addEventListener('submit', (event) => {
  event.preventDefault(); // evita o recarregamento da página

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const nascimento = document.getElementById('nascimento').value;

  adicionarPaciente(nome, email, nascimento);
  renderizarTabela();

  formulario.reset(); // limpa os campos do formulário
})
// =================================================
    // VERIFICAR E-MAIL DUPLICADO
    // =================================================

    const emailJaExiste =
      pacientes.some((paciente) => {

        return paciente.email.toLowerCase()
          === email.toLowerCase();

      });


    if (emailJaExiste) {

      alert(
        'Este e-mail já está cadastrado!'
      );

      return;

    }


    // Adiciona o paciente
    adicionarPaciente(
      nome,
      email,
      telefone,
      nascimento
    );


    // Atualiza a tabela
    renderizarTabela();


    // Limpa o formulário
    formulario.reset();

  ;


// =====================================================
// BUSCA POR NOME
// =====================================================

busca.addEventListener(
  'input',
  () => {

    // Texto digitado
    const texto =
      busca.value.toLowerCase();


    // Filtra os pacientes
    const pacientesFiltrados =
      pacientes.filter((paciente) => {

        return paciente.nome
          .toLowerCase()
          .includes(texto);

      });


    // Mostra somente os encontrados
    renderizarTabela(
      pacientesFiltrados
    );

  }
);


// =====================================================
// ORDENAR POR NOME
// =====================================================

ordenarNome.addEventListener(
  'click',
  () => {

    pacientes.sort(
      (a, b) => {

        const nomeA =
          a.nome.toLowerCase();

        const nomeB =
          b.nome.toLowerCase();


        if (nomeA < nomeB) {

          return ordemCrescente
            ? -1
            : 1;

        }


        if (nomeA > nomeB) {

          return ordemCrescente
            ? 1
            : -1;

        }


        return 0;

      }
    );


    // Inverte a próxima ordenação
    ordemCrescente =
      !ordemCrescente;


    // Salva a nova ordem
    salvarPacientes();


    // Atualiza tabela
    renderizarTabela();

  }
);


// =====================================================
// CARREGAR OS PACIENTES AO ABRIR A PÁGINA
// =====================================================

// Quando a página abrir, mostra os pacientes
// que estavam salvos anteriormente.
renderizarTabela();
;