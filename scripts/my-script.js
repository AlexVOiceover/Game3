
const playAudio = (src, callback) => {
  const audio = new Audio(src);
  audio.play();
  audio.addEventListener("ended", callback);
};


document.getElementById("audio1").addEventListener("click", () => checkAnswer("Eagle"));
document.getElementById("audio2").addEventListener("click", () => checkAnswer("Cat"));


