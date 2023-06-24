const maxDegrees = 5;
const decodSeconds = 8;
let x = 0;
let y = 0;
let roll = 0;
let pitch = 0;
let rolldeviation = 0;
let pitchdeviation = 0;
const smoothFactor = 0.8;
let timer = 0;
let timerLine = 0;
let activated = false;
let arrayMorse = [];
let lastChar;
const maxDiameter = 300; 

const playAudio = (src, callback) => {
  const audio = new Audio(src);
  audio.play();
  audio.addEventListener("ended", callback);
};

const backgroundMusic = document.getElementById("backgroundMusic");
backgroundMusic.volume = 0.5;

document.getElementById("resetPosition").addEventListener("click", () => {
  rolldeviation = roll;
  pitchdeviation = pitch;
  drawDot(canvas.width/2, canvas.height/2);
});

document.getElementById("startTransmissionButton").addEventListener("change", function () {
  if (this.checked) {
    backgroundMusic.play();
    activated = true;
    } else {
    backgroundMusic.pause();
    activated = false;
  }
});


window.addEventListener("deviceorientation", (event) => {
  if (activated) {
    if (event.gamma === null) {
      console.log("Device orientation not supported or permission denied");
      updateDotPosition();
      return;
    }

    roll = event.gamma.toFixed(4); 
    const adjustedRoll = roll - rolldeviation;

    let horTextboxValue = 0;

    if (adjustedRoll <= (-1*maxDegrees)){
      horTextboxValue = -1}
    else if (adjustedRoll >= maxDegrees){
      horTextboxValue = 1}
    else {
      horTextboxValue =  adjustedRoll/maxDegrees }
    
    // Round the textbox value to 4 decimal places
    horTextboxValue = parseFloat(horTextboxValue.toFixed(4));

    // Calculate the x coordinate for the dot
    x = ((horTextboxValue + 1) / 2) * canvas.width;
  }
});

window.addEventListener("deviceorientation", (event) => {
  if (activated) {
    if (event.beta === null) {
      console.log("Device orientation not supported or permission denied");
      updateDotPosition();
      return;
    }

    pitch = event.beta.toFixed(4); // Pitch value in degrees
    const adjustedPitch = pitch - pitchdeviation;

    let verTextboxValue = 0;

    if (adjustedPitch <= (-1*maxDegrees)){
      verTextboxValue = -1}
    else if (adjustedPitch >= maxDegrees){
      verTextboxValue = 1}
    else {
      verTextboxValue =  adjustedPitch/maxDegrees}
    
    // Round the textbox value to 4 decimal places
    verTextboxValue = parseFloat(verTextboxValue.toFixed(4));

    // Calculate the y coordinate for the dot
    y = ((verTextboxValue + 1) / 2) * canvas.height;
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

let signalPosX = Math.random() * canvas.width;
let signalPosY = Math.random() * canvas.height;

//Radar line
function drawLine(angle) {
  const lineLength = Math.sqrt(Math.pow(canvas.width / 2, 2) + Math.pow(canvas.height / 2, 2));
  const adjustedAngle = angle - Math.PI / 2; // Subtract Math.PI / 2 from the angle
  const endPointX = lineLength * Math.cos(adjustedAngle);
  const endPointY = lineLength * Math.sin(adjustedAngle);

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(endPointX, endPointY);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  ctx.stroke();
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

   // Draw horizontal white line
   ctx.beginPath();
   ctx.moveTo(0, canvas.height / 2);
   ctx.lineTo(canvas.width, canvas.height / 2);
   ctx.strokeStyle = "rgb(0, 255, 0)";
   ctx.lineWidth = 1;
   ctx.stroke();
 
   // Draw vertical white line
   ctx.beginPath();
   ctx.moveTo(canvas.width / 2, 0);
   ctx.lineTo(canvas.width / 2, canvas.height);
   ctx.strokeStyle = "rgb(0, 255, 0)";
   ctx.lineWidth = 1;
   ctx.stroke();
   
   if (activated){

/*
 // Signal, Red Dot
    ctx.beginPath();
    ctx.arc(signalPosX, signalPosY, 5, 0, 2 * Math.PI); // Draw a dot with a radius of 5
    ctx.fillStyle  = "rgb(255, 85, 85)";
    ctx.fill(); */
 
    // Moving circle
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, 2 * Math.PI); 
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();

    timerLine += 0.03;
    //Draw radar line
    const rotationAngle = (timerLine / decodSeconds) * Math.PI;
    drawLine(rotationAngle);

    // Red dot will decrease with time
     // Calculate the normalized timer value in the range [0, 1]
     const normalizedTimer = decodSeconds / timerLine;
     
     // Draw the red dot with the updated opacity
     ctx.beginPath();
     ctx.arc(signalPosX, signalPosY, 5*normalizedTimer, 0, 2 * Math.PI);
     ctx.fillStyle = "rgb(255, 85, 85)";
     ctx.fill();

  }

  // Check if the red dot is inside the white circle
  const isInside = isRedDotInsideBlueCircle(signalPosX, signalPosY, x, y, 9);

  if (isInside) {
    timer += 0.1;
    document.getElementById("messages").innerText  = "Capturing";

  
     // Calculate the remaining time and normalize it to the range [0, decodSeconds]
     const remainingTime = decodSeconds - (timer % decodSeconds);

     // Draw the decreasing circle
     drawDecreasingCircle(ctx, signalPosX, signalPosY, maxDiameter, remainingTime, decodSeconds);



    // Check if the timer reaches decodSeconds seconds
    if (timer >= decodSeconds) {
      // Generate a random character and call playMorseCode with that character
      document.getElementById("messages").innerText  = "Decoded!";
      lastChar = generateRandomCharacter();
      arrayMorse.push(lastChar);;
      playMorseCode(lastChar);
      //document.getElementById("inputChar").value = randomChar;
      document.getElementById("arrayMorseTextbox").value = arrayMorse.join(" ");
      // Generate new coordinates for the red dot
      signalPosX = Math.random() * canvas.width;
      signalPosY = Math.random() * canvas.height;

      // Reset the timer
      timer = 0;
    }
  } else {
    if (timer > 0 && timer < decodSeconds) {
      document.getElementById("messages").innerText = "Lost transmission";
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
  const morseCode = {
      'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',   'E': '.',
      'F': '..-.',  'G': '--.',   'H': '....',  'I': '..',    'J': '.---',
      'K': '-.-',   'L': '.-..',  'M': '--',    'N': '-.',    'O': '---',
      'P': '.--.',  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
      'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',  'Y': '-.--',
      'Z': '--..',  '0': '-----', '1': '.----', '2': '..---', '3': '...--',
      '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
  };

  const multiplier = 1;

  const dotDuration = 0.1 * multiplier; // 100ms
  const dashDuration = 0.3 * multiplier; // 300ms
  const gapDuration = 0.3 * multiplier; // 100ms
  const frequency = 750; // 1000Hz

  const code = morseCode[char.toUpperCase()];
  let currentTime = 0;

  for (let i = 0; i < code.length; i++) {
      setTimeout(() => {
          playTone(frequency, code[i] === '.' ? dotDuration : dashDuration);
      }, currentTime * 1000);

      currentTime += (code[i] === '.' ? dotDuration : dashDuration) + gapDuration;
  }
}

document.getElementById("playMorseCode").addEventListener("click", () => {
  //const inputChar = document.getElementById("inputChar").value;
  if (lastChar.length === 1) {
      playMorseCode(lastChar);
  }
});

// Function to generate a random character
function generateRandomCharacter() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters[randomIndex];
}

animationLoop();