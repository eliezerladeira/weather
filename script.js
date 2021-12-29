/* Designed by Eliezer Ladeira on 09/25/2021  */

// quando for pressionado o botão de busca
// document: é o documento html; querySelector: procura no formulário pela class
// addEventListener: fica ouvindo o formulário, caso 'submit' recebe event e executa a função
// async: indica ao javascript que a função vai executar código assíncrono, ou seja, que não é ordenado
document.querySelector('.busca').addEventListener('submit', async (event)=>{
    
    // previne o comportamento padrão que o formulário deveria ter, no caso, enviar e atualizar o formulário e perder o que digitou na caixa de texto
    event.preventDefault();

    // recupera o que foi digitado na caixa de texto com id searchInput
    let input = document.querySelector('#searchInput').value;

    clearInfo();

    if (input != '') {
        showWarning('Carregando...');

        // template string, montando a url
        //api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
        // encodURI retira os espaços e introduz caracteres especiais. Ex.: Rio de Janeiro -> Rio%20de%20Janeiro
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(input)}&appid=b737866aaac3f0c16534f8c1b72904d3&units=metric&lang=pt_br`;

        // fazendo a requisição
        // await: espera o resultado
        let results = await fetch(url);

        // monta o retorno como objeto para que possa ser lido
        let json = await results.json();

        // cod 200, consulta com sucesso
        if (json.cod === 200) {
            // main.feels_like: sensação térmica
            // main.humidity: umidade do ar
            // main.pressure: pressão atmosférica
            // main.temp_max
            // main.temp_min
            showInfo({
                name: json.name,
                country: json.sys.country,
                temp: json.main.temp,
                tempIcon: json.weather[0].icon,
                windSpeed: json.wind.speed,
                windAngle: json.wind.deg
            })
        }
        else {
            showWarning('Localização não encontrada!');
        }
    }
    else {
        showWarning('Localização não encontrada!');
    }
});

// função que mostra as informações na tela
function showInfo(json) {
    showWarning('');

    document.querySelector('.titulo').innerHTML = `${json.name}, ${json.country}`;
    document.querySelector('.tempInfo').innerHTML = `${json.temp} <sup>ºC</sup>`;
    document.querySelector('.ventoInfo').innerHTML = `${json.windSpeed} <span>km/h</span>`;

    // pegando o link da imagem no html e trocando a imagem no src
    document.querySelector('.temp img').setAttribute('src',`http://openweathermap.org/img/wn/${json.tempIcon}@2x.png`);
    document.querySelector('.ventoPonto').style.transform = `rotate(${json.windAngle-90}deg)`;

    // alterando o css para que a div resultado apareça
    document.querySelector('.resultado').style.display = 'block';
};

// função que limpa os dados da pesquisa
function clearInfo() {
    showWarning('');
    document.querySelector('.resultado').style.display = 'none';
}

// função que apresenta mensagens no lugar específico
function showWarning(msg) {
    document.querySelector('.aviso').innerHTML = msg;
}