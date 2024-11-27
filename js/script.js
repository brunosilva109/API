// main.js

async function loadPaisData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/brunosilva109/API/refs/heads/main/json/paises.json');
        
        if (!response.ok) throw new Error("Erro ao carregar os dados dos países.");
        
        return await response.json();
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar os dados dos países.");
    }
}

async function loadPaisSelect() {
    const selectElement = document.getElementById('pais-select');
    const paises = await loadPaisData();

    paises.forEach(pais => {
        const option = document.createElement('option');
        option.value = pais.sigla;
        option.textContent = pais.nome_pais;
        selectElement.appendChild(option);
    });

    selectElement.addEventListener('change', (e) => {
        const sigla = e.target.value;
        if (sigla) {
            const pais = paises.find(p => p.sigla === sigla);
            showPaisData(pais);
        }
    });
}

// Exibir dados do país
function showPaisData(pais) {
    const dadosPaisElement = document.getElementById('dados-pais');
    dadosPaisElement.innerHTML = `
        <li><strong>Nome:</strong> ${pais.nome_pais}</li>
        <li><strong>Sigla:</strong> ${pais.sigla}</li>
        <li><strong>Gentílico:</strong> ${pais.gentilico}</li>
        <li><strong>Nome Internacional:</strong> ${pais.nome_pais_int}</li>
    `;
}

// Função para consultar o CEP
async function consultarCep() {
    const cep = document.getElementById('cep-input').value.replace(/\D/g, ''); // Remove caracteres não numéricos
    const dadosCepElement = document.getElementById('dados-cep');

    if (cep.length === 8) {
        try {
            const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);
            if (!response.ok) throw new Error('CEP não encontrado.');

            const dadosCep = await response.json();

            // Exibindo as informações do CEP conforme a estrutura fornecida
            dadosCepElement.innerHTML = `
                <li><strong>CEP:</strong> ${dadosCep.cep}</li>
                <li><strong>Rua:</strong> ${dadosCep.street}</li>
                <li><strong>Bairro:</strong> ${dadosCep.neighborhood}</li>
                <li><strong>Cidade:</strong> ${dadosCep.city}</li>
                <li><strong>Estado:</strong> ${dadosCep.state}</li>
                <li><strong>Serviço:</strong> ${dadosCep.service}</li>
            `;
        } catch (error) {
            dadosCepElement.innerHTML = `<li><strong>Erro:</strong> ${error.message}</li>`;
        }
    } else {
        alert("Por favor, insira um CEP válido.");
    }
}

// Inicializar a página
document.addEventListener("DOMContentLoaded", () => {
    loadPaisSelect();
    
    const cepButton = document.getElementById('cep-button');
    cepButton.addEventListener('click', consultarCep);
});
