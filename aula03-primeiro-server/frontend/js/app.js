const pacientes = [];
let pacientesJson = 0;
let pacientesManuais = 0;

// Agora os pacientes vêm do BACKEND
const URL_API = 'http://localhost:3000/pacientes';

const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');
const mensagemCarregando = document.getElementById('carregando');

function adicionarPaciente(nome, email, nascimento) {
    pacientes.push({ nome, email, nascimento });
}

function atualizarContador() {
    let contador = document.getElementById('contador-origem');

    if (!contador) {
        contador = document.createElement('p');
        contador.id = 'contador-origem';
        contador.className = 'text-muted';

        document.querySelector('.container').appendChild(contador);
    }

    contador.innerHTML = `
        Pacientes do arquivo JSON: ${pacientesJson} |
        Pacientes cadastrados manualmente: ${pacientesManuais}
    `;
}

function renderizarTabela() {
    tabela.innerHTML = '';

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

function formatarData(dataISO) {
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
}

async function carregarPacientesIniciais() {
    try {
        mensagemCarregando.textContent = 'Carregando pacientes...';

        // Simula 1 segundo de espera
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Busca os pacientes no servidor Node
        const resposta = await fetch(URL_API);

        console.log(resposta);

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();

        pacientesJson = dados.length;

        if (dados.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center">
                        Nenhum paciente cadastrado ainda
                    </td>
                </tr>
            `;

            atualizarContador();
            mensagemCarregando.style.display = 'none';
            return;
        }

        dados.forEach((paciente) => {
            adicionarPaciente(
                paciente.nome,
                paciente.email,
                paciente.nascimento
            );
        });

        renderizarTabela();
        atualizarContador();

        mensagemCarregando.style.display = 'none';

    } catch (erro) {
        console.error('Não foi possível carregar os pacientes:', erro);

        mensagemCarregando.textContent =
            'Erro ao carregar pacientes. O servidor está rodando?';
    }
}

formulario.addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const nascimento = document.getElementById('nascimento').value;

    adicionarPaciente(nome, email, nascimento);

    pacientesManuais++;

    renderizarTabela();
    atualizarContador();

    formulario.reset();
});

carregarPacientesIniciais();