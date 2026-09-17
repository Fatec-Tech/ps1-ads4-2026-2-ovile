const API_URL = 'https://pokeapi.co/api/v2/pokemon';

const pokemonGrid = document.getElementById('pokemonGrid');
const loading = document.getElementById('loading');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// Elementos do modal
const modalElement = document.getElementById('pokemonModal');
const modalTitle = document.getElementById('pokemonModalTitle');
const modalBody = document.getElementById('pokemonModalBody');

const pokemonModal = new bootstrap.Modal(modalElement);




async function fetchPokemonData(urlOrName) {

    const url = urlOrName.startsWith('http')
        ? urlOrName
        : `${API_URL}/${urlOrName.toLowerCase().trim()}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Pokémon não encontrado');
    }

    console.log('Response:', response);

    return await response.json();
}




async function loadInitialPokemon(limit = 20) {

    showLoading(true);
    pokemonGrid.innerHTML = '';

    try {

        const response = await fetch(`${API_URL}?limit=${limit}`);

        if (!response.ok) {
            throw new Error('Erro ao carregar a lista');
        }

        const data = await response.json();

        // Faz as requisições dos detalhes em paralelo
        const pokemonPromises = data.results.map((item) =>
            fetchPokemonData(item.url)
        );

        const pokemonList = await Promise.all(pokemonPromises);

        // Renderiza cada card
        pokemonList.forEach(renderPokemonCard);

    } catch (error) {

        showError('Erro ao carregar a lista de Pokémon. Verifique sua conexão e tente novamente.');

        console.error(error);

    } finally {

        showLoading(false);
    }
}




function renderPokemonCard(pokemon) {

    console.log('Rendering Pokémon:', pokemon);

    // Pega a imagem oficial
    const imageUrl =
        pokemon.sprites.other['official-artwork'].front_default ||
        pokemon.sprites.front_default;

    // Mapeia os tipos para badges
    const typesBadges = pokemon.types
        .map(
            (t) =>
                `<span class="badge bg-secondary badge-type">${t.type.name}</span>`
        )
        .join('');

    // Formata peso e altura
    const heightInMeters = (pokemon.height / 10).toFixed(1);
    const weightInKg = (pokemon.weight / 10).toFixed(1);

    const cardHTML = `
        <div class="col">

            <div
                class="card h-100 shadow-sm pokemon-card border-0"
                data-pokemon-id="${pokemon.id}"
                role="button"
                tabindex="0"
                aria-label="Ver detalhes de ${pokemon.name}"
            >

                <div class="text-center p-3 bg-white rounded-top">

                    <img
                        src="${imageUrl}"
                        class="card-img-top img-fluid"
                        style="max-height: 160px; object-fit: contain;"
                        alt="${pokemon.name}"
                    >

                </div>

                <div class="card-body">

                    <div class="d-flex justify-content-between align-items-center mb-2">

                        <h5 class="card-title text-capitalize fw-bold m-0">
                            ${pokemon.name}
                        </h5>

                        <small class="text-muted">
                            #${String(pokemon.id).padStart(3, '0')}
                        </small>

                    </div>

                    <div class="mb-3">
                        ${typesBadges}
                    </div>

                    <div class="row text-center border-top pt-2">

                        <div class="col-6 border-end">
                            <small class="text-muted d-block">Altura</small>
                            <strong>${heightInMeters} m</strong>
                        </div>

                        <div class="col-6">
                            <small class="text-muted d-block">Peso</small>
                            <strong>${weightInKg} kg</strong>
                        </div>

                    </div>

                    <p class="text-center text-muted small mt-3 mb-0">
                        Clique para ver detalhes
                    </p>

                </div>
            </div>
        </div>
    `;

    pokemonGrid.insertAdjacentHTML('beforeend', cardHTML);
}




async function openPokemonModal(id) {

    modalTitle.textContent = 'Carregando Pokémon...';

    modalBody.innerHTML = `
        <div class="text-center p-4">

            <div class="spinner-border text-danger" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>

            <p class="mt-2">
                Buscando informações do Pokémon...
            </p>

        </div>
    `;

    pokemonModal.show();

    try {

        const pokemon = await fetchPokemonData(String(id));

        preencherModal(pokemon);

    } catch (error) {

        console.error(error);

        modalTitle.textContent = 'Erro ao carregar Pokémon';

        modalBody.innerHTML = `
            <div class="alert alert-warning">
                Não foi possível carregar os detalhes deste Pokémon.
                Verifique sua conexão e tente novamente.
            </div>

            <button
                class="btn btn-danger"
                id="tentarNovamente"
                type="button"
            >
                Tentar novamente
            </button>
        `;

        document
            .getElementById('tentarNovamente')
            .addEventListener('click', () => openPokemonModal(id));
    }
}




function preencherModal(pokemon) {

    modalTitle.textContent =
        `#${String(pokemon.id).padStart(3, '0')} - ${pokemon.name}`;

    const imageUrl =
        pokemon.sprites.other['official-artwork'].front_default ||
        pokemon.sprites.front_default;

    const typesBadges = pokemon.types
        .map(
            (t) =>
                `<span class="badge bg-secondary badge-type">${t.type.name}</span>`
        )
        .join('');

    const heightInMeters = (pokemon.height / 10).toFixed(1);
    const weightInKg = (pokemon.weight / 10).toFixed(1);

    modalBody.innerHTML = `
        <div class="text-center mb-4">

            <img
                src="${imageUrl}"
                alt="${pokemon.name}"
                class="img-fluid"
                style="max-height: 200px; object-fit: contain;"
            >

            <h3 class="text-capitalize fw-bold mt-2">
                ${pokemon.name}
            </h3>

            <div class="mb-3">
                ${typesBadges}
            </div>

            <p>
                <strong>Altura:</strong> ${heightInMeters} m
            </p>

            <p>
                <strong>Peso:</strong> ${weightInKg} kg
            </p>

        </div>

        <hr>

        <h5 class="fw-bold mb-3">Status</h5>
        <div id="pokemonStats"></div>

        <hr>

        <h5 class="fw-bold mb-3">Habilidades</h5>
        <div id="pokemonAbilities"></div>

        <hr>

        <h5 class="fw-bold mb-3">Áudio do Pokémon</h5>
        <div id="pokemonAudio"></div>

        <hr>

        <h5 class="fw-bold mb-3">Sprites</h5>

        <div
            id="pokemonSprites"
            class="row row-cols-2 row-cols-md-4 g-3"
        ></div>
    `;

    // Preenche cada parte do modal
    renderStats(pokemon);
    renderAbilities(pokemon);
    renderAudio(pokemon);
    renderSprites(pokemon);
}



function renderStats(pokemon) {

    const statsContainer = document.getElementById('pokemonStats');

    const statsDesejados = {
        hp: 'HP',
        attack: 'Ataque',
        defense: 'Defesa',
        speed: 'Velocidade'
    };

    const stats = pokemon.stats.filter((stat) =>
        Object.keys(statsDesejados).includes(stat.stat.name)
    );

    statsContainer.innerHTML = stats
        .map((stat) => {

            const nome = statsDesejados[stat.stat.name];
            const valor = stat.base_stat;

            // Converte o valor em porcentagem para a barra
            const porcentagem = Math.min((valor / 255) * 100, 100);

            return `
                <div class="mb-3">

                    <div class="d-flex justify-content-between mb-1">
                        <span>${nome}</span>
                        <strong>${valor}</strong>
                    </div>

                    <div
                        class="progress"
                        role="progressbar"
                        aria-label="${nome}"
                        aria-valuenow="${Math.round(porcentagem)}"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style="height: 20px;"
                    >

                        <div
                            class="progress-bar bg-danger"
                            style="width: ${porcentagem}%"
                        >
                            ${Math.round(porcentagem)}%
                        </div>

                    </div>
                </div>
            `;
        })
        .join('');
}



function renderAbilities(pokemon) {

    const abilitiesContainer =
        document.getElementById('pokemonAbilities');

    abilitiesContainer.innerHTML = pokemon.abilities
        .map((item) => {

            const nome = item.ability.name.replace(/-/g, ' ');

            const habilidadeOculta = item.is_hidden
                ? '<span class="badge bg-warning text-dark ms-2">Oculta</span>'
                : '';

            return `
                <div class="mb-2">

                    <span class="badge bg-primary text-capitalize">
                        ${nome}
                    </span>

                    ${habilidadeOculta}

                </div>
            `;
        })
        .join('');
}




function renderAudio(pokemon) {

    const audioContainer = document.getElementById('pokemonAudio');

    const audioUrl =
        pokemon.cries?.latest ||
        pokemon.cries?.legacy;

    if (audioUrl) {

        audioContainer.innerHTML = `
            <audio controls preload="none" class="w-100">
                <source src="${audioUrl}" type="audio/ogg">
                Seu navegador não suporta áudio HTML5.
            </audio>
        `;

    } else {

        audioContainer.innerHTML = `
            <p class="text-muted">
                Áudio não disponível para este Pokémon.
            </p>
        `;
    }
}



function renderSprites(pokemon) {

    const spritesContainer =
        document.getElementById('pokemonSprites');

    const sprites = [
        {
            nome: 'Frente',
            imagem: pokemon.sprites.front_default
        },
        {
            nome: 'Costas',
            imagem: pokemon.sprites.back_default
        },
        {
            nome: 'Frente Shiny',
            imagem: pokemon.sprites.front_shiny
        },
        {
            nome: 'Costas Shiny',
            imagem: pokemon.sprites.back_shiny
        }
    ];

    spritesContainer.innerHTML = sprites
        .map((sprite) => {

            if (sprite.imagem) {

                return `
                    <div class="col">

                        <div class="sprite-container">

                            <img
                                src="${sprite.imagem}"
                                alt="${sprite.nome} de ${pokemon.name}"
                                class="pokemon-sprite img-fluid"
                            >

                            <p class="small text-muted">
                                ${sprite.nome}
                            </p>

                        </div>

                    </div>
                `;

            }

            return `
                <div class="col">

                    <div class="sprite-container">

                        <p class="small text-muted">
                            ${sprite.nome}
                        </p>

                        <p class="small">
                            Não disponível
                        </p>

                    </div>

                </div>
            `;
        })
        .join('');
}




async function handleSearch() {

    const query = searchInput.value.trim();

    if (!query) {
        loadInitialPokemon();
        return;
    }

    showLoading(true);
    pokemonGrid.innerHTML = '';

    try {

        const pokemon = await fetchPokemonData(query);

        renderPokemonCard(pokemon);

    } catch (error) {

        showError(
            `Nenhum Pokémon encontrado com o termo "${query}".`
        );

    } finally {

        showLoading(false);
    }
}



function showLoading(state) {

    if (state) {
        loading.classList.remove('d-none');
    } else {
        loading.classList.add('d-none');
    }
}


function showError(message) {

    pokemonGrid.innerHTML = `
        <div class="col-12">

            <div class="alert alert-warning text-center" role="alert">
                ${message}
            </div>

        </div>
    `;
}




// Clique no botão Buscar
searchBtn.addEventListener('click', handleSearch);

// Busca ao pressionar Enter
searchInput.addEventListener('keypress', (e) => {

    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Clique nos cards para abrir o modal
pokemonGrid.addEventListener('click', (e) => {

    const card = e.target.closest('[data-pokemon-id]');

    if (card) {
        openPokemonModal(card.dataset.pokemonId);
    }
});

// Abrir o modal usando Enter ou Espaço
pokemonGrid.addEventListener('keydown', (e) => {

    if (e.key === 'Enter' || e.key === ' ') {

        const card = e.target.closest('[data-pokemon-id]');

        if (card) {
            e.preventDefault();
            openPokemonModal(card.dataset.pokemonId);
        }
    }
});




loadInitialPokemon();