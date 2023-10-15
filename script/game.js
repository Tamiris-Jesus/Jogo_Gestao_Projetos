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

// Selecionando elementos HTML pela classe
const grid = document.querySelector('.grid');
const spanPlayer = document.querySelector('.player');
const timer = document.querySelector('.timer');

// Função auxiliar para criar elementos com classes
function createElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

let players = []; // Lista de jogadores

// Definir a direção das bombas (da direita para a esquerda)
let dirxBombas = -1;

// Adicione uma variável de controle
let gameOver = false;

function endGameMenu() {
  if (!gameOver) { // Verifique se o menu de fim de jogo ainda não foi exibido
    const container = document.querySelector('.container');
    container.style.display = 'flex'; // Exibe o container do jogo

    const restartBtn = document.querySelector('.restart-btn');
    const homeBtn = document.querySelector('.home-btn');

    restartBtn.addEventListener('click', reinicia); // Adiciona ouvinte de evento para o botão de reiniciar
    homeBtn.addEventListener('click', goToHomePage); // Adiciona ouvinte de evento para o botão de voltar para a página inicial 

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
  this.loop = setInterval(() => {
    const currentTime = +timer.innerHTML;
    timer.innerHTML = currentTime + 1;
  }, 1000); // Atualiza o temporizador a cada 1 segundo
};


// Função para voltar para a página inicial
const goToHomePage = () => {
  clearInterval(this.loop); // Limpa o intervalo do temporizador
  window.location.href = '../index.html'; // Redireciona o navegador para a página inicial
};

function init() {
  startTimer(); // Inicie o temporizador

  jogo = true; // Altere para true para iniciar o jogo imediatamente

  tamTelaH = window.innerHeight;
  tamTelaW = window.innerWidth;

  dirxJ = diryJ = 0;
  pjx = tamTelaW / 2;
  pjy = tamTelaH / 2;
  velJ = velT = 5;
  jog = document.getElementById("naveJog");
  jog.style.top = pjy + "px";
  jog.style.left = pjx + "px";

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
  var tecla = event.keyCode;
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
    atira(pjx + 17, pjy);
  }
}

// Função para parar o movimento do jogador
function teclaUp(event) {
  var tecla = event.keyCode;
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
    var x = dirxBombas === -1 ? tamTelaW : -30;
    var y = Math.random() * tamTelaH;
    var bomba = document.createElement("div");
    bomba.className = "bomba";
    bomba.style.top = y + "px";
    bomba.style.left = x + "px";
    document.body.appendChild(bomba);
    contBombas--;
  }
}

// Função para mover as bombas da direita para a esquerda
function controlaBomba() {
  bombasTotal = document.getElementsByClassName("bomba");
  var tam = bombasTotal.length;
  for (var i = 0; i < tam; i++) {
    if (bombasTotal[i]) {
      var pi = bombasTotal[i].offsetLeft;
      pi += dirxBombas * velB;
      bombasTotal[i].style.left = pi + "px";
      if (pi > tamTelaW || pi < -30) {
        vidaPlaneta -= 10;
        criaExplosao(2, pi, bombasTotal[i].offsetTop);
        bombasTotal[i].remove();
      }
    }
  }
}




// Modifique a função atira para criar os tiros corretamente
function atira(x, y) {
  var t = document.createElement("div");
  t.className = "tiroJog";
  t.style.top = y + "px";
  t.style.left = x + "px";
  document.body.appendChild(t);
  moveTiro(t); // Chama a função para movimentar o tiro
}

// Adicione uma nova função para mover os tiros
function moveTiro(tiro) {
  var intervalo = setInterval(() => {
    var pt = tiro.offsetLeft;
    pt += dirxJ * velT; // Mova os tiros na direção definida pelo jogador
    tiro.style.left = pt + "px";
    colisaoTiroBomba(tiro);
    if (pt > tamTelaW || pt < -6) {
      clearInterval(intervalo);
      tiro.remove();
    }
  }, 10); // Ajuste o intervalo de atualização do tiro conforme necessário
}

function atira(x, y) {
  var t = document.createElement("div");
  var att1 = document.createAttribute("class");
  var att2 = document.createAttribute("style");
  att1.value = "tiroJog";
  att2.value = "top:" + y + "px;left:" + x + "px";
  t.setAttributeNode(att1);
  t.setAttributeNode(att2);
  document.body.appendChild(t);
}


function controleTiros() {
  var tiros = document.getElementsByClassName("tiroJog");
  var tam = tiros.length;
  for (var i = 0; i < tam; i++) {
    if (tiros[i]) {
      var pt = tiros[i].offsetTop;
      pt -= velT;
      tiros[i].style.top = pt + "px";
      colisaoTiroBomba(tiros[i]);
      if (pt < 0) {
        tiros[i].remove();
      }
    }
  }
}

function colisaoTiroBomba(tiro) {
  var tam = bombasTotal.length;
  for (var i = 0; i < tam; i++) {
    if (bombasTotal[i]) {
      if (
        (tiro.offsetTop <= (bombasTotal[i].offsetTop + 40)) &&
        ((tiro.offsetTop + 6) >= (bombasTotal[i].offsetTop)) &&
        (tiro.offsetLeft <= (bombasTotal[i].offsetLeft + 24)) &&
        ((tiro.offsetLeft + 6) >= (bombasTotal[i].offsetLeft))
      ) {
        criaExplosao(1, bombasTotal[i].offsetLeft - 25, bombasTotal[i].offsetTop);
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
  var explosao = document.createElement("div");
  var img = document.createElement("img");
  var som = document.createElement("audio");
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
    
  }
}

// Loop principal do jogo
function gameLoop() {
  if (jogo) {
    controlaJogador();
    controleTiros();
    controlaBomba();
  }
  gerenciaGame();
  frames = requestAnimationFrame(gameLoop);
}

// Função para reiniciar o jogo
function reinicia() {
  const container = document.querySelector('.container');
  container.style.display = 'none'; // Esconde o container do jogo

  timer.innerHTML = '00'; // Reinicia o valor do temporizador para "00"
  clearInterval(this.loop); // Limpa o intervalo do temporizador
  startTimer(); //reinicia o temporizador


  bombasTotal = document.getElementsByClassName("bomba");
  var tam = bombasTotal.length;
  for (var i = 0; i < tam; i++) {
    if (bombasTotal[i]) {
      bombasTotal[i].remove();
    }
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
  gameLoop();
}

/* ranking  */
const showRanking = () => {
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

  // Use a função de comparação para ordenar do maior para o menor tempo
  players.sort((a, b) => b.time - a.time);

  players.forEach((player, index) => {
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
};

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