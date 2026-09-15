const pacientes = [];
let pacientesJson = 0;
let pacientesManuais = 0;

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
		

       
        await new Promise(resolve => setTimeout(resolve, 1000));

		const resposta = await fetch('data/pacientes.json');
		//const resposta = await fetch('data/arquivo-inexistente.json'); teste de erro

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

    mensagemCarregando.textContent = 'Dados carregados com sucesso.';

    return;
}

dados.forEach((paciente) => {
    adicionarPaciente(paciente.nome, paciente.email, paciente.nascimento);
});

renderizarTabela();
atualizarContador();
	} catch (erro) {
		console.error('Não foi possível carregar os pacientes:', erro);
		mensagemCarregando.textContent =
			'Não foi possível carregar os pacientes porque os dados não foram encontrados. Verifique o arquivo pacientes.json e tente novamente';
		return; 
	}

	mensagemCarregando.textContent =
		'Dados carregados com sucesso.';
	
}

formulario.addEventListener('submit', (event) => {
	event.preventDefault();

	const nome = document.getElementById('nome').value;
	const email = document.getElementById('email').value;
	const nascimento = document.getElementById('nascimento').value;

	adicionarPaciente(nome, email, nascimento);
	renderizarTabela();

	pacientesManuais++;
	atualizarContador();
	formulario.reset();
});


carregarPacientesIniciais();
