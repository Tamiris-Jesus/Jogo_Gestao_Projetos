
const input = document.querySelector('.login_input');
const button = document.querySelector('.login_button');
const form = document.querySelector('.login_form');
const infoBtn = document.querySelector('.mostrarInfo')
const informacoes = document.querySelector('.info')
const fecharBtn = document.querySelector('.closeInfo')

const validateInput = ({ target }) => {
  if(target.value.length > 2){
    button.removeAttribute('disabled');
    return;
  }
    button.setAttribute('disabled', ''); 
}

const handleSubmit = (event) => {
  event.preventDefault();

  localStorage.setItem('player', input.value);
  window.location = 'pages/game.html';
}

const showInfo = (event) => {
  event.preventDefault();

  informacoes.style.display = "flex"
  informacoes.style.visibility = "visible"
}

const hideInfo = (event) => {
  event.preventDefault();

  informacoes.style.display = "none"
  informacoes.style.visibility = "hidden"
}

input.addEventListener('input', validateInput);
form.addEventListener('submit', handleSubmit);
infoBtn.addEventListener('click', showInfo)
fecharBtn.addEventListener('click', hideInfo)


