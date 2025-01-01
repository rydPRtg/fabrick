/*
DONE:
1. Build basic UI for a coin-flipping game
1. Buy honestcasino.com
==========================================================
TODO:
1. Customer feedback mechanism
1. Announce on forums (Reddit/poker, Show HN, others)
1. NoSleep for phone browsers
0. Keyboard shortcuts (h,H=>Heads, t,T=> Tails)
2. Flipping Sound
3. Winning sound
*/

var result = 'heads';
var chosen = result;
var headClass = 'coin-heads';
var tailClass = 'coin-tails';

var balance;
var coinState;

const betUnit = 25;

const DGEBI = document.getElementById.bind(document);

var imgHead = DGEBI(headClass);
var imgTail = DGEBI(tailClass);
var btnHeads = DGEBI('btn-heads');
var btnTails = DGEBI('btn-tails');
var divResult = DGEBI('div-result');
var divBalance = DGEBI('div-balance');
var divDebugInfo = DGEBI('div-debuginfo');

/* Init game state; this function is intentionally unnamed, executed using IIFE */
(function(){
  balance = 2500;
  coinState = 'stopped';
  divBalance.innerHTML = balance;
})();

function serverGetRandomByte(callback) {
  var val = randomIntInc(0,255); // mimic NodeJS' `crypto.randomBytes(1)`
  setTimeout(function() {callback(val)}, 1000 * randomIntInc(1,3))
}

// Returns a random number in range [low,high]; that is, both ends of the range are inclusive
function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function flip(p) {
  chosen = p
  startSpinning();
}

/*function toggleSpinning(){if(coinState==='spinning')stopSpinning();}else{startSpinning();}}*/

document.onkeypress = function(e){detectKeyPress(e)};
function detectKeyPress(e) {
  const key = e.key;
  if (key === 'h' || key === 'H') {
    flip('heads')
  } else if (key === 't' || key === 'T') {
    flip('tails')
  } else if (key === 'd') {
    divDebugInfo.style.display = 'none';
  } else if (key === 'D') {
    divDebugInfo.style.display = 'block';
  }
}

function updateResult() {
  divResult.innerHTML = result;
  
  if (debug) {
    divDebugInfo.innerHTML = debugText;
  } else {
    divDebugInfo.innerHTML = '';
  }
}

function startSpinning() {
  if (coinState === 'spinning')
    return;
  coinState = 'spinning';
  
  balance = balance - betUnit;

  result = '?'
  updateResult();

  divBalance.innerHTML = balance;
  btnHeads.disabled = btnTails.disabled = true;
  imgHead.classList.add(headClass);
  imgTail.classList.add(tailClass);
  imgHead.style.display = imgTail.style.display = 'block';

  serverGetRandomByte(stopSpinning);
}

function stopSpinning(val) {
  if (coinState === 'stopped')
    return;
  coinState = 'stopped';
  
  btnHeads.disabled = btnTails.disabled = false;
  imgHead.classList.remove(headClass);
  imgTail.classList.remove(tailClass);

  if (val % 51 === 0) {
    /* The coin landed on edge; This is also the house-edge. */
    result = "edge";
  } else if (val % 2 === 0) {
    result = "heads";
  } else {
    result = "tails";
  }
  
  if (result === "edge") {
    divResult.innerHTML = 'Edge!!!';
  } else if (result == chosen) {
    balance = balance + (2 * betUnit);
    divResult.innerHTML = 'You won!!!';
  } else {
    divResult.innerHTML = 'You lost :-(';
  }
  
  divBalance.innerHTML = balance;

  if (result === 'edge') {
    imgTail.style.display = 'none';
    imgHead.style.display = 'none';
  } else if (result === "heads") {
    imgTail.style.display = 'none';
  } else {
    imgHead.style.display = 'none';
  }

  // Debugging code
  if (debug) {
    iter = iter + 1;
    if (balance < lowBalance) lowBalance = balance;
    if (balance > highBalance) highBalance = balance;
    
    if (result === 'edge') edges = edges + 1;
    else if (result === 'heads') heads = heads + 1;
    else if (result === 'tails') tails = tails + 1;
    
    if (result === chosen) correctGuesses = correctGuesses +1;
    else wrongGuesses = wrongGuesses +1;

    debugText = `<table id='debuginfo'>`
    +`<tr><td>Random value</td><td>${val}</td></tr>`
    +`<tr><td>Total flips</td><td>${iter}</td></tr>`
    +`<tr><td>Landed on edge</td><td>${edges}</td></tr>`
    +`<tr><td>Landed on heads</td><td>${heads}</td></tr>`
    +`<tr><td>Landed on tails</td><td>${tails}</td></tr>`
    +`<tr><td>Correct guesses</td><td>${correctGuesses}</td></tr>`
    +`<tr><td>Wrong guesses</td><td>${wrongGuesses}</td></tr>`
    +`<tr><td>Low balance</td><td>${lowBalance}</td></tr>`
    +`<tr><td>High balance</td><td>${highBalance}</td></tr>`
    +`</table>`;
    
    updateResult();
    //setTimeout(function(){btnTails.click()}, 500)
  }
}

var debug = false;
var debugText = '';
var iter = 0;
var edges = 0;
var heads = 0;
var tails = 0;
var correctGuesses = 0;
var wrongGuesses = 0;
var lowBalance = balance;
var highBalance = balance;