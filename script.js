const cards = document.querySelectorAll('.card');
let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;
let minute = 0;
let second = 0;
let millisecond = 0;
let cron;
let count = 0;
let final = 0;
let nome;
let tempo;
let tempoRanking;

nome = window. prompt("Enter your name: "); //solicita o nome para o jogador
document.addEventListener("DOMContentLoaded", insereNomeRanking) //atualiza o ranking ao carregar/recarregar a página

function insereNomeRanking(){
  
  let i =0;
  let nomeRanking;
  let novoItem;
  let itemRanking;
  let lista = document.getElementById("listaRanking");
  
  //cria a lista do ranking adicionando elementos ao DOM
  
  while(i < localStorage.length){
    nomeRanking = localStorage.key(i);
    tempoRanking = localStorage.getItem(nomeRanking);
    novoItem = document.createElement("li");
    itemRanking = document.createTextNode(nomeRanking + " " + tempoRanking);
    novoItem.appendChild(itemRanking);
    lista.insertBefore(novoItem, null);
    i++;
  }
}

function start() {
  pause();
  cron = setInterval(() => { timer(); }, 10);
}

function timer() {
  if ((millisecond += 10) == 1000) {
    millisecond = 0;
    second++;
  }
  if (second == 60) {
    second = 0;
    minute++;
  }

  document.getElementById('minute').innerText = returnData(minute);
  document.getElementById('second').innerText = returnData(second);
}

function returnData(input) {
  return input > 10 ? input : `0${input}`
}

function flipCard(){
    if (lockBoard) return;
    if(this === firstCard) return; //serve para evitar que algum espertinho clique duas vezes na mesma carta e acabe deixando ela virada para sempre 

    this.classList.add('flip') //o this insere/retira a classe 'flip' para a carta que estiver sendo clicada naquele momento.

    count ++;
    if(count === 1){
        start();
    }

    if(!hasFlippedCard){
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    hasFlippedCard = false;
    checkForMath()
}

function checkForMath(){
  let i = 0;
  let minuto = document.getElementById('minute').innerText;
  let segundo = document.getElementById('second').innerText;
  
  if(firstCard.dataset.card === secondCard.dataset.card){
        disableCards();
        final ++;
        if(final == 6){
            pause();         
            tempo = minuto + ":" + segundo;
            //Se o nome não existe adiciona no ranking.
            if(!Object.keys(localStorage).includes(nome)){
              localStorage.setItem(nome,tempo);
            //Se o nome já existe e se o tempo foi menor que o existente altera no ranking.
            }else if(Object.keys(localStorage).includes(nome) == true && tempoRanking > tempo) {
              localStorage.setItem(nome,tempo);//armazena o ranking no browser do usuário
            }
        }
        return;
    }
    unflipCards();
}

function disableCards(){
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

function unflipCards() {
    lockBoard = true; /* Serve para evitar que algum espertinho saia clicando rapidamente em várias cartas. */

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
        lockBoard = false; /*destrava o tabuleiro após a comparação para permitir continuar o jogo. */
    },1500)
}

//Reinicia as variáveis para o valor inicial quando for necessário.
function resetBoard(){
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null]
}

//embaralha as cartas
(function shuffle() {
    cards.forEach((card) => {
        let randomPosition = Math.floor(Math.random() * 12);
        card.style.order = randomPosition;
    })
})();

cards.forEach((card) => {
    card.addEventListener('click', flipCard)
});
