var app = document.getElementById('app');

var typewriter = new Typewriter(app, {
  loop: true,
  delay: 75,
});

typewriter
  .pauseFor(1000)
  .typeString('THE ARM SUDOKU')
  .pauseFor(300)
  .deleteChars(10)
  .start();


document.querySelector("#howtoplay2").addEventListener("click" , function(){
    document.querySelector("#gamerules").scrollIntoView({behavior:"smooth"});
})