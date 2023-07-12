const maxDegrees = 5;
const decodTime = 15;
let x = 0;
let y = 0;
let signalPosX = -100;
let signalPosY = -100;
let roll = 0;
let pitch = 0;
let rolldeviation = 0;
let pitchdeviation = 0;
const smoothFactor = 0.8;
let timer = 0;
let timerLine = 0;
let segmentSpeed = 0.0004;
let activated = false;
let arrayMorse = [];
let lastChar;
const maxDiameter = 300;
let numSymbols = 4;
let focusCircleDiameter = 15;
let finishedGame = false;
let playingBeep = false;
const frequency = 1200; // 1000Hz
const backgroundMusic = document.getElementById("backgroundMusic");
backgroundMusic.volume = 0.4;

  //ADDED TO PLAY TUNNING AUDIO
  let audio = new Audio('audios/tunning.ogg');
  audio.volume = 0.1;
  audio.loop = true;

  // Get the current URL
  var url = new URL(window.location.href);
  // Get the search parameters from the URL
  var params = new URLSearchParams(url.search);
  // Retrieve a specific parameter by name
  var paramValue1 = params.get('param1');
  switch (paramValue1) {
    case '1':
      segmentSpeed = 0.0002;
      break;
    case '2':
      segmentSpeed = 0.0004;
      break;
    default:
      segmentSpeed = 0.0006;
  }

  var paramValue2 = params.get('param2');
  switch (paramValue2) {
    case '1':
      focusCircleDiameter = 25;
      break;
    case '2':
      focusCircleDiameter = 15;
      break;
    default:
      focusCircleDiameter = 8;
  }

  var paramValue3 = params.get('param3');
  switch (paramValue3) {
    case '1':
      numSymbols = 3;
      break;
    case '2':
      numSymbols = 4;
      break;
    default:
      numSymbols = 5;
  }

window.onload = function () {
    document.getElementById('modalSpy').style.display = "block";
    document.getElementById('instructionModal').style.display = "none";
};

function resetPosition() {
  rolldeviation = roll;
  pitchdeviation = pitch;
  drawDot(canvas.width / 2, canvas.height / 2);
}

document.getElementById("resetPosition").addEventListener("click", resetPosition);

document.getElementById("startTransmissionButton").addEventListener("change", function () {
  resetPosition()
  if (this.checked) {
    backgroundMusic.play();
    activated = true;
    signalPosX = Math.random() * canvas.width;
    signalPosY = Math.random() * canvas.height;
    
    } else {
    backgroundMusic.pause();
    activated = false;
  }
  document.getElementById("resetPosition").classList.toggle("enabled");
  
});

// Get the charaters-container element
const upperContainer = document.querySelector('.characters-container');
// Loop through the number of symbols and create textboxes
for (let i = 0; i < numSymbols; i++) {
  const textbox = document.createElement('input');
  textbox.type = 'text';
  textbox.classList.add('charactersTextboxes');
  textbox.classList.add('charactersTextboxes--readonly');
  // Add the textbox to the container
  upperContainer.appendChild(textbox);
}
// Get all the textboxes with the class 'charactersTextboxes'
const textboxes = upperContainer.querySelectorAll('.charactersTextboxes');

// Get the charaters-container element
const guessedContainer = document.querySelector('.charactersGuessed-container');
// Loop through the number of symbols and create textboxes
for (let i = 0; i < numSymbols; i++) {
  const textbox = document.createElement('input');
  textbox.type = 'text';
  textbox.maxLength = 1; 
  textbox.classList.add('charactersTextboxes');
  // Add the textbox to the container
  guessedContainer.appendChild(textbox);
}

// Get all the textboxes with the class 'charactersTextboxes'
const guessedtextboxes = guessedContainer.querySelectorAll('.charactersTextboxes');
// After inserting each character jumps to the next one
guessedContainer.addEventListener('input', (e) => {
  const target = e.target;

if (target.value.length >= target.maxLength) {
    const next = target.nextElementSibling;
    if (next && next.tagName.toLowerCase() === 'input') {
      next.focus();
    }
  }
});

window.addEventListener("deviceorientation", (event) => {
  if ( !finishedGame) {
    if (event.gamma === null) {
      console.log("Device orientation not supported or permission denied");
      updateDotPosition();
      return;
    }

    roll = event.gamma.toFixed(4); 
    const adjustedRoll = roll - rolldeviation;

    let horValue = 0;

    if (adjustedRoll <= (-1*maxDegrees)){
      horValue = -1}
    else if (adjustedRoll >= maxDegrees){
      horValue = 1}
    else {
      horValue =  adjustedRoll/maxDegrees }
    
    // Round the vertical value value to 4 decimal places
    horValue = parseFloat(horValue.toFixed(4));

    // Calculate the x coordinate for the dot
    x = ((horValue + 1) / 2) * canvas.width;
  }
});

window.addEventListener("deviceorientation", (event) => {
  if (!finishedGame) {
    if (event.beta === null) {
      console.log("Device orientation not supported or permission denied");
      updateDotPosition();
      return;
    }

    pitch = event.beta.toFixed(4); // Pitch value in degrees
    const adjustedPitch = pitch - pitchdeviation;

    let verValue = 0;

    if (adjustedPitch <= (-1*maxDegrees)){
      verValue = -1}
    else if (adjustedPitch >= maxDegrees){
      verValue = 1}
    else {
      verValue =  adjustedPitch/maxDegrees}
    
    // Round the vertical value value to 4 decimal places
    verValue = parseFloat(verValue.toFixed(4));

    // Calculate the y coordinate for the dot
    y = ((verValue + 1) / 2) * canvas.height;
  }
});

//Function to calculate the lerp between two values. Its a trick to make it smooth.
function lerp(a, b, t) {
  return a + (b - a) * t;
}

let smoothX = 0;
let smoothY = 0;

const canvas = document.getElementById("dotCanvas");
const ctx = canvas.getContext("2d");

//Radar segment. input 0 to 1
function drawSegment(progress) {
  const lineLength = Math.sqrt(Math.pow(canvas.width / 2, 2) + Math.pow(canvas.height / 2, 2));
  const startAngle = -Math.PI / 2; // Start at 12 o'clock
  const endAngle = startAngle + 2 * Math.PI * progress;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, lineLength, startAngle, endAngle, false);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fillStyle = "rgb(0,20,0,0.5)";
  ctx.fill();
  ctx.restore();
}

//Decreasing circle over signal
function drawDecreasingCircle(ctx, x, y, maxDiameter, remainingTime, totalTime) {
  const diameter = maxDiameter * (remainingTime / totalTime);
  ctx.beginPath();
  ctx.arc(x, y, diameter / 2, 0, 2 * Math.PI);
  ctx.strokeStyle = 'white';
  ctx.stroke();
  ctx.restore();
}


function drawDot(x, y) {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height); 
  
  // Draw radar circles
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2,100, 0, 2 * Math.PI);
  ctx.strokeStyle = "rgb(0, 255, 0)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 60, 0, 2 * Math.PI);
  ctx.strokeStyle = "rgb(0, 255, 0)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 25, 0, 2 * Math.PI);
  ctx.strokeStyle = "rgb(0, 255, 0)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 5, 0, 2 * Math.PI);
  ctx.strokeStyle = "rgb(0, 255, 0)";
  ctx.lineWidth = 1;
  ctx.stroke();

   // Draw horizontal green line
   ctx.beginPath();
   ctx.moveTo(0, canvas.height / 2);
   ctx.lineTo(canvas.width, canvas.height / 2);
   ctx.strokeStyle = "rgb(0, 255, 0)";
   ctx.lineWidth = 1;
   ctx.stroke();
 
   // Draw vertical green line
   ctx.beginPath();
   ctx.moveTo(canvas.width / 2, 0);
   ctx.lineTo(canvas.width / 2, canvas.height);
   ctx.strokeStyle = "rgb(0, 255, 0)";
   ctx.lineWidth = 1;
   ctx.stroke();
   
   if (activated){
  
      timerLine += segmentSpeed;
      // Draw Radar Segment;
      //REFACTOR THESE IFS
      if (!finishedGame){drawSegment(timerLine);}

      if (timerLine <= 1) {

         if (!finishedGame){

            if (!playingBeep){
              // Signal, Red Dot
              ctx.beginPath();
              ctx.arc(signalPosX, signalPosY, 5, 0, 2 * Math.PI); // Draw a dot with a radius of 5
              ctx.fillStyle  = "rgb(255, 85, 85)";
              ctx.fill();
            }

          // Focus circle
          ctx.beginPath();
          ctx.arc(x, y, focusCircleDiameter, 0, 2 * Math.PI); 
          ctx.strokeStyle = "white";
          ctx.lineWidth = 2;
          ctx.stroke();

            // Crosshair lines
            const lineLength = 5;  // Length of crosshair lines
            const insideCircle = 0.30 * focusCircleDiameter;

            // Top line
            ctx.beginPath();
            ctx.moveTo(x, y - focusCircleDiameter - lineLength);
            ctx.lineTo(x, y - focusCircleDiameter + insideCircle);
            ctx.stroke();
            // Bottom line
            ctx.beginPath();
            ctx.moveTo(x, y + focusCircleDiameter + lineLength);
            ctx.lineTo(x, y + focusCircleDiameter - insideCircle);
            ctx.stroke();
            // Left line
            ctx.beginPath();
            ctx.moveTo(x - focusCircleDiameter - lineLength, y);
            ctx.lineTo(x - focusCircleDiameter + insideCircle, y);
            ctx.stroke();
            // Right line
            ctx.beginPath();
            ctx.moveTo(x + focusCircleDiameter + lineLength, y);
            ctx.lineTo(x + focusCircleDiameter - insideCircle, y);
            ctx.stroke();

          }
      } else if (!finishedGame ) { 
        document.getElementById("messages").innerText  = "Time out!";
        document.getElementById("messages").style.backgroundColor = "rgba(100, 34, 40, 0.55)";
        finishedGame=true;}  
   }

  // Check if the red dot is inside the white circle
  const isInside = isRedDotInsideBlueCircle(signalPosX, signalPosY, x, y, focusCircleDiameter);

  if (isInside & !playingBeep) {
    timer += 0.1;
    document.getElementById("messages").innerText  = "Capturing";

    //ADDED TO PLAY TUNNING AUDIO
    audio.play().catch(function(error) {
      console.log('Failed to play audio:', error);
    });

     // Calculate the remaining time and normalize it to the range [0, decodTime]
     const remainingTime = decodTime - (timer % decodTime);

     // Draw the decreasing circle if segment < 1
     if (timerLine <= 1) {
      drawDecreasingCircle(ctx, signalPosX, signalPosY, maxDiameter, remainingTime, decodTime);
     }

    // Check if the timer reaches decodTime seconds = decoded signal
    if (timer >= decodTime && !playingBeep) {

    //ADDED TO PLAY TUNNING AUDIO
    audio.pause();

      if (arrayMorse.length +1 === numSymbols) {document.getElementById("messages").innerText  = "All signals captured";}
      else {document.getElementById("messages").innerText  = "Signal captured";}

      lastChar = generateRandomCharacter();
      arrayMorse.push(lastChar);
      textboxes[arrayMorse.length - 1].value = "*";
      playMorseCode(lastChar);

      document.getElementById("cheatTextbox").textContent = arrayMorse.join(" ");
      
      // Generate new coordinates for the red dot (if not playing previous morse code)
      if (!playingBeep){
        signalPosX = Math.random() * canvas.width;
        signalPosY = Math.random() * canvas.height;
      }

      // Reset the timer
      timer = 0;
      document.getElementById("playMorseCode").classList.add('enabled');
    }
  } else {
    if (timer > 0 && timer < decodTime) {
      document.getElementById("messages").innerText = "Signal lost";

      //ADDED TO PLAY TUNNING AUDIO
      audio.pause();
    }
    timer = 0;
  }
 
}

function updateDotPosition(smooth) {
  smoothX = lerp(smoothX, x, smooth);
  smoothY = lerp(smoothY, y, smooth);
  drawDot(smoothX, smoothY);
}

//Added this function to constantly update position and timer
function animationLoop() {
  updateDotPosition(smoothFactor);
  requestAnimationFrame(animationLoop);

  if (arrayMorse.length === numSymbols){finishedGame = true;}
}

// Check if the red dot is inside the white circle
function isRedDotInsideBlueCircle(redX, redY, whiteX, whiteY, radius) {
  const distance = Math.sqrt(Math.pow(redX - whiteX, 2) + Math.pow(redY - whiteY, 2));
  return distance <= radius;
}

//Function to play a tone given a frequency and duration
let audioContext;
function playTone(frequency, duration) {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration - 0.01);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);

  // Add this line to release resources after the tone has played
  oscillator.onended = () => {
    gainNode.disconnect(audioContext.destination);
    oscillator.disconnect(gainNode);
  };
}

function playMorseCode(char) {

  if (playingBeep) {
    return;
  }

  const morseCode = {
      'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',   'E': '.',
      'F': '..-.',  'G': '--.',   'H': '....',  'I': '..',    'J': '.---',
      'K': '-.-',   'L': '.-..',  'M': '--',    'N': '-.',    'O': '---',
      'P': '.--.',  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
      'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',  'Y': '-.--',
      'Z': '--..',  '0': '-----', '1': '.----', '2': '..---', '3': '...--',
      '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
  };

  const multiplier = 0.8;

  const dotDuration = 0.2 * multiplier; // 100ms
  const dashDuration = 0.6 * multiplier; // 300ms
  const gapDuration = 0.2 * multiplier; // 100ms
 

  const code = morseCode[char.toUpperCase()];
  let currentTime = 0;

  for (let i = 0; i < code.length; i++) {
      setTimeout(() => {
          playingBeep = true;
          playTone(frequency, code[i] === '.' ? dotDuration : dashDuration);
      }, currentTime * 1000);

      currentTime += (code[i] === '.' ? dotDuration : dashDuration) + gapDuration;
  }
 // Set playingBeep back to false after the last beep finishes
 function setPlayingBeepToFalse() {
  playingBeep = false;
}

const delay = currentTime * 1000;
setTimeout(setPlayingBeepToFalse, delay);
}


//Pressiong on the version it will show the cheatTextbox
//Here I wanted to mimic the 5 presses on the build number to unlock
let buildPresses = 5;
var toggleVisibility = document.getElementById("toggleVisibility");
var cheatTextbox = document.getElementById("cheatTextbox");
toggleVisibility.addEventListener('click', function() {
  buildPresses--;
  if (buildPresses === 0) {
    cheatTextbox.textContent = "Cheat mode: On";
    cheatTextbox.style.display = "inline-block";
  }
  //After activating cheat mode if press again shows characters
  else {cheatTextbox.textContent = arrayMorse.join(" ");}
});


// display instructionModal only when instructionButton is clicked
document.getElementById('instructionButton').addEventListener('click', function() {
  // hide modalSpy when instructionModal is about to be shown
  document.getElementById('modalSpy').style.display = "none";
  // now show the instructionModal
  document.getElementById('instructionModal').style.display = 'block';
});



document.getElementById("playMorseCode").addEventListener("click", () => {
   if (lastChar) {
      playMorseCode(lastChar);
  }
}); 

  document.getElementById("verifyCode").addEventListener("click", () => {
  let isRight = true; 
  
  //Added to have haptic response
  if (navigator.vibrate) { // Check if the browser supports the Vibration API
    navigator.vibrate(75); // Vibrate for 200ms
  } else {
    console.log("Your browser does not support the Vibration API.");
  }
  
  for (let i = 0; i < arrayMorse.length; i++) {
    
    if (arrayMorse[i] !== guessedtextboxes[i].value){
      isRight = false;
      guessedtextboxes[i].style.backgroundColor = "rgba(100, 34, 40, 0.5)";
    }

    // Write the right signals on textboxes
    textboxes[i].value = arrayMorse[i];

  }
  if (isRight && arrayMorse.length == numSymbols) {
    document.getElementById("messages").innerText = "Decoding success";
    document.getElementById("messages").style.backgroundColor = "rgba(34, 63, 40, 0.55)";

    //Canplaythrough estimates the enough time to load the audio
    const selectAudio = new Audio("./audios/rightDecode.ogg");
    selectAudio.volume = 0.2;
    selectAudio.addEventListener('canplaythrough', function() {
        selectAudio.play().catch(function(error) {
            console.log('Failed to play audio:', error);
        });
    }, false);

  } else {
    document.getElementById("messages").innerText = "Decodification failed";
    document.getElementById("messages").style.backgroundColor = "rgba(100, 34, 40, 0.55)";

    //Canplaythrough estimates the enough time to load the audio
    const selectAudio = new Audio("./audios/wrongDecode.ogg");
    selectAudio.volume = 0.2;
    selectAudio.addEventListener('canplaythrough', function() {
        selectAudio.play().catch(function(error) {
            console.log('Failed to play audio:', error);
        });
    }, false);

  }
  finishedGame = true;
  // Because the game is finished, add '.charactersTextboxes--readonly' to each textbox
  guessedtextboxes.forEach((textbox) => {
    textbox.classList.add('charactersTextboxes--readonly');   
  });
  });

// Function to generate a random character
function generateRandomCharacter() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters[randomIndex];
}

//Use this to stop the music when user swapps to another app
document.addEventListener('visibilitychange', function() {
  if (document.hidden){
      // Pause the music when the page is not visible
      backgroundMusic.pause();
  } else {
      // Resume the music when the page is visible again
      backgroundMusic.play();
  }
});

// Get the QR modal
var modal = document.getElementById("qrModal");
// Get the button that opens the modal
var btn = document.getElementById("findHelper");
// When the user clicks the button, open the modal 
btn.onclick = function() {
  // Check the value of value3 and update the image source accordingly
  switch(value3) {
    case 1:
      qrImage.src = "./images/qr3.png";
      break;
    case 2:
      qrImage.src = "./images/qr4.png";
      break;
    case 3:
      qrImage.src = "./images/qr5.png";
      break;
    default:
      console.log("An unexpected value of value3: ", value3);
  }
  // Show the modal
  modal.style.display = "block";
}

animationLoop();