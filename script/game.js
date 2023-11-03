// Selecionando elementos HTML pela classe
const grid = document.querySelector('.grid');
const spanPlayer = document.querySelector('.player');
const timer = document.querySelector('.timer');

// Declarando variáveis
let diryJ = 0, dirxJ = 0, jog, velJ = 5, pjx, pjy;
let velT;
let tamTelaW, tamTelaH;
let jogo;
let frames;
let contBombas, velB, tmpCriaBomba;
let bombasTotal;
let vidaPlaneta, barraPlaneta;
let ie = 0, isom = 0;
let dirxT = 1;
let municao;
// let gameOver;
let gameOver = false;


// localStorage.clear();
const pauseButton = document.getElementById("pauseButton");
let isPaused = false;
let elapsedGameTime = 0;
const helpButton = document.getElementById("helpButton");
const infoDiv = document.querySelector(".info");

let infoVisible = false;


pauseButton.addEventListener("click", () => {
  if (isPaused) {
    isPaused = false;
    pauseButton.textContent = "Pausar";
    gameLoop();
  } else {
    isPaused = true;
    pauseButton.textContent = "Retomar jogo";
    cancelAnimationFrame(frames);
  }
});

const imagens = [
  "../assets/barrel.png",
  "../assets/soda.png",
  "../assets/nuclear.png",
  "../assets/garbage.png",
];


// Função auxiliar para criar elementos com classes
function createElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

let players = []; // Lista de jogadores

// Definir a direção das bombas (da direita para a esquerda)
let dirxBombas = -1;

function endGameMenu() {
  if (!gameOver) { // Verifique se o menu de fim de jogo ainda não foi exibido
    const container = document.querySelector('.container');
    container.style.display = 'flex'; // Exibe o container do jogo

    const restartBtn = document.querySelector('.restart-btn');
    const homeBtn = document.querySelector('.home-btn');

    restartBtn.addEventListener('click', reinicia); 
    homeBtn.addEventListener('click', goToHomePage); 

    const playerName = spanPlayer.innerHTML;
    const playerTime = timer.innerHTML;
    players.push({ name: playerName, time: playerTime });
    localStorage.setItem('players', JSON.stringify(players));
    showRanking();
    // Defina a variável de controle como verdadeira para evitar chamadas adicionais
    gameOver = true;
  }
}


// Função para iniciar o temporizador
const startTimer = () => {
  clearInterval(this.loop); // Limpa o intervalo do temporizador existente
  elapsedGameTime = 0; // Reinicia o tempo
  this.loop = setInterval(() => {
    if (!isPaused) {
      elapsedGameTime += 1;
      timer.innerHTML = elapsedGameTime;
    }
  }, 1000);
};

// Função para voltar para a página inicial
const goToHomePage = () => {
  clearInterval(this.loop); // Limpa o intervalo do temporizador
  window.location.href = '../index.html'; // Redireciona o navegador para a página inicial
};

function init() {
  startTimer(); 

  jogo = true; 

  gameOver = false;

  tamTelaH = window.innerHeight;
  tamTelaW = window.innerWidth;

  dirxJ = diryJ = 0;
  pjx = tamTelaW / 2;
  pjy = tamTelaH / 2;
  velJ = velT = 5;
  jog = document.getElementById("naveJog");
  jog.style.top = pjy + "px";
  jog.style.left = pjx + "px";

  municao = 7;

  contBombas = 150;
  velB = 3;

  vidaPlaneta = 100;
  barraPlaneta = document.getElementById("barraPlaneta");
  barraPlaneta.style.width = vidaPlaneta + "px";

  ie = ison = 0;

  window.addEventListener("keydown", teclaDw);
  window.addEventListener("keyup", teclaUp);

  tmpCriaBomba = setInterval(criaBomba, 1700);
  gameLoop(); // Inicie o loop do jogo imediatamente
}

// Função para controlar o movimento do jogador
function teclaDw(event) {
  let tecla = event.keyCode;
  if (tecla == 38) { // Cima
    diryJ = -1;
  } else if (tecla == 40) { // Baixo
    diryJ = 1;
  }
  if (tecla == 37) { // Esquerda
    dirxJ = -1;
  } else if (tecla == 39) { // Direita
    dirxJ = 1;
  }
  if (tecla == 32) { // Espaço / Tiro
    atira(pjx + 100, pjy + 40);
    atualizaContagemBalas();
  }
}

// Função para parar o movimento do jogador
function teclaUp(event) {
  let tecla = event.keyCode;
  if ((tecla == 38) || (tecla == 40)) {
    diryJ = 0;
  }
  if ((tecla == 37) || (tecla == 39)) { // Esquerda
    dirxJ = 0;
  }
}

// Função para criar bombas
function criaBomba() {
  if (jogo) {
    let x = dirxBombas === -1 ? tamTelaW : -30;
    let y = Math.random() * tamTelaH;
    let bomba = document.createElement("img");
    bomba.className = "bomba";
    bomba.style.top = y + "px";
    bomba.style.left = x + "px";

    const imagemAleatoria = imagens[Math.floor(Math.random() * imagens.length)];
    bomba.src = imagemAleatoria;

    // bomba.style.backgroundImage = `url('')`;

    document.body.appendChild(bomba);
    contBombas--;
  }
}

// Função para mover as bombas da direita para a esquerda
function controlaBomba() {
  bombasTotal = document.getElementsByClassName("bomba");
  let tam = bombasTotal.length;
  for (let i = 0; i < tam; i++) {
    if (bombasTotal[i]) {
      let pi = bombasTotal[i].offsetLeft;
      pi += dirxBombas * velB;
      bombasTotal[i].style.left = pi + "px";
      if (pi > tamTelaW || pi < -30) {
        vidaPlaneta -= 10;
        criaExplosao(2, pi, bombasTotal[i].offsetTop);
        escureceTela();
        bombasTotal[i].remove();
      }
    }
  }
}

function atira(x, y) {
  if (municao > 0) {
    let t = document.createElement("div");
    let att1 = document.createAttribute("class");
    let att2 = document.createAttribute("style");
    att1.value = "tiroJog";
    att2.value = "top:" + y + "px;left:" + x + "px";
    t.setAttributeNode(att1);
    t.setAttributeNode(att2);
    document.body.appendChild(t);

    municao -= 1;

  } else {
    const mensagemRecarregando = document.getElementById("recarregando");
    mensagemRecarregando.style.display = "block";
    setTimeout(() => {
      recarregaBalas();
      mensagemRecarregando.style.display = "none"; // Oculte a mensagem de recarregamento
    }
      , 2000);

  }
}

function atualizaContagemBalas() {
  const balasElement = document.querySelector('.balas');
  balasElement.textContent = `Munição: ${municao}`;
}

function recarregaBalas() {
  // Defina o número de balas para o valor desejado (por exemplo, 10)
  municao = 7;
  atualizaContagemBalas(); // Atualize a exibição da contagem de balas
}


function controleTiros() {
  let tiros = document.getElementsByClassName("tiroJog");
  let tam = tiros.length;
  for (let i = 0; i < tam; i++) {
    if (tiros[i]) {
      let pt = tiros[i].offsetLeft;
      pt += dirxT * velT; // Mova o tiro na direção especificada por dirxT
      tiros[i].style.left = pt + "px";
      colisaoTiroBomba(tiros[i]);
      if (pt > tamTelaW || pt < -6) {
        tiros[i].remove();
      }
    }
  }
}


// function colisaoTiroBomba(tiro) {
//   let tam = bombasTotal.length;
//   for (let i = 0; i < tam; i++) {
//     if (bombasTotal[i]) {
//       if (
//         (tiro.offsetTop <= (bombasTotal[i].offsetTop + 40)) &&
//         ((tiro.offsetTop + 6) >= (bombasTotal[i].offsetTop)) &&
//         (tiro.offsetLeft <= (bombasTotal[i].offsetLeft + 24)) &&
//         ((tiro.offsetLeft + 6) >= (bombasTotal[i].offsetLeft))
//       ) {
//         criaExplosao(1, bombasTotal[i].offsetLeft - 25, bombasTotal[i].offsetTop);
//         bombasTotal[i].remove();
//         tiro.remove();
//       }
//     }
//   }
// }



function colisaoTiroBomba(tiro) {
  let tam = bombasTotal.length;
  for (let i = 0; i < tam; i++) {
    if (bombasTotal[i]) {
      const tiroRect = tiro.getBoundingClientRect();
      const bombaRect = bombasTotal[i].getBoundingClientRect();

      if (
        tiroRect.top <= bombaRect.bottom &&
        tiroRect.bottom >= bombaRect.top &&
        tiroRect.left <= bombaRect.right &&
        tiroRect.right >= bombaRect.left
      ) {
        criaExplosao(1, bombaRect.left - 25, bombaRect.top);
        bombasTotal[i].remove();
        tiro.remove();
      }
    }
  }
}


// Função para criar explosões
function criaExplosao(tipo, x, y) {
  if (document.getElementById("explosao" + (ie - 4))) {
    document.getElementById("explosao" + (ie - 4)).remove();
  }
  let explosao = document.createElement("div");
  let img = document.createElement("img");
  let som = document.createElement("audio");
  explosao.id = "explosao" + ie;
  if (tipo == 1) {
    explosao.className = "explosaoAr";
    explosao.style.top = y + "px";
    explosao.style.left = x + "px";
    img.src = "../assets/explosao_ar.gif?" + new Date();
  } else {
    explosao.className = "explosaoChao";
    explosao.style.top = (tamTelaH - 57) + "px";
    explosao.style.left = (x - 17) + "px";
    img.src = "../assets/explosao_chao.gif?" + new Date();
  }
  som.src = "../assets/exp1.mp3?" + new Date();
  som.id = "som" + isom;
  explosao.appendChild(img);
  explosao.appendChild(som);
  document.body.appendChild(explosao);
  document.getElementById("som" + isom).play();
  ie++;
  isom++;
}

function escureceTela() {
  const darkLayer = document.createElement("div");
  darkLayer.className = "dark-layer";
  document.body.appendChild(darkLayer);
}


function removeTelaEscura() {
  const darkLayer = document.getElementsByClassName("dark-layer");

  while (darkLayer.length > 0) {
    darkLayer[0].remove();
  }
}
// Função para controlar o movimento do jogador
function controlaJogador() {
  pjx += dirxJ * velJ;
  pjy += diryJ * velJ;
  jog.style.top = pjy + "px";
  jog.style.left = pjx + "px";
}

// Função para gerenciar o jogo
function gerenciaGame() {
  barraPlaneta.style.width = vidaPlaneta + "px";
  if (vidaPlaneta <= 0) {
    jogo = false;
    clearInterval(tmpCriaBomba);

    clearInterval(this.loop); // Limpa o intervalo do temporizador

    localStorage.setItem('playerTime', timer.innerHTML);
    localStorage.setItem('playerName', spanPlayer.innerHTML);
    endGameMenu(); // Chame endGameMenu() quando o jogador vencer

    gameOver = true;

  }
}

function gameLoop() {
  if (!isPaused && !gameOver) { // Verifique se o jogo não acabou
    controlaJogador();
    controleTiros();
    controlaBomba();
    gerenciaGame();
    frames = requestAnimationFrame(gameLoop);
  } else {
    frames = requestAnimationFrame(gameLoop);
  }
  return;
}


// Função para reiniciar o jogo
function reinicia() {
  gameOver = false;
  const container = document.querySelector('.container');
  container.style.display = 'none'; // Esconde o container do jogo

  timer.innerHTML = '00'; // Reinicia o valor do temporizador para "00"
  clearInterval(this.loop); // Limpa o intervalo do temporizador existente
  elapsedGameTime = 0; // Reinicia o tempo
  startTimer(); // Reinicia o temporizador

  const bombas = document.getElementsByClassName("bomba");
  while (bombas.length > 0) {
    bombas[0].remove();
  }

  clearInterval(tmpCriaBomba);
  cancelAnimationFrame(frames);
  vidaPlaneta = 100;
  pjx = tamTelaW / 2;
  pjy = tamTelaH / 2;
  jog.style.top = pjy + "px";
  jog.style.left = pjx + "px";
  contBombas = 150;
  jogo = true;
  tmpCriaBomba = setInterval(criaBomba, 1700);

  recarregaBalas();
  removeTelaEscura();

  gameLoop();
}



/* ranking  */
function showRanking() {
  const existingTable = document.querySelector('.ranking table');
  if (existingTable) {
    existingTable.remove(); // Remove a tabela de classificação existente
  }

  players.sort((a, b) => b.time - a.time); // Ordene os jogadores pelo tempo do MAIOR para o MENOR

  const topPlayers = players.slice(0, 5); // Pegue os 5 melhores jogadores

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const thRank = document.createElement('th');
  const thName = document.createElement('th');
  const thTime = document.createElement('th');

  thRank.textContent = '#';
  thName.textContent = 'Nome';
  thTime.textContent = 'Tempo (segundos)';

  thead.appendChild(thRank);
  thead.appendChild(thName);
  thead.appendChild(thTime);
  table.appendChild(thead);

  topPlayers.forEach((player, index) => {
    const tr = document.createElement('tr');
    const tdRank = document.createElement('td');
    const tdName = document.createElement('td');
    const tdTime = document.createElement('td');
    tdRank.textContent = index + 1;
    tdName.textContent = player.name;
    tdTime.textContent = player.time;
    tr.appendChild(tdRank);
    tr.appendChild(tdName);
    tr.appendChild(tdTime);
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);

  const ranking = document.querySelector('.ranking');
  ranking.appendChild(table);
}


helpButton.addEventListener("click", function() {
  if (!infoVisible) {
    infoDiv.style.display = "flex";
    infoVisible = true;
  } else {
    infoDiv.style.display = "none";
    infoVisible = false;
  }
});

helpButton.addEventListener("click", () => {
  if (!isPaused) {
    isPaused = true;
    pauseButton.textContent = "Retomar jogo";
    cancelAnimationFrame(frames);
  }
});

const infoBtn = document.querySelector('.mostrarInfo');
const informacoes = document.querySelector('.info');
const fecharBtn = document.querySelector('.closeInfo');

const hideInfo = (event) => {
  event.preventDefault();
  informacoes.style.display = 'none';
};

fecharBtn.addEventListener('click', hideInfo);


window.onload = () => {
  const container = document.querySelector('.container');
  container.style.display = 'none'; // Esconde o container do jogo

  const storedPlayers = JSON.parse(localStorage.getItem('players'));
  if (storedPlayers) {
    players = storedPlayers;
  }
  spanPlayer.innerHTML = localStorage.getItem('player');

  init();
};

