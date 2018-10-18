document.addEventListener("DOMContentLoaded", () => {
  //Execute callback after DOM loads

  // The number of words to display
  const wordCount = 10;
  //The number of guesses available
  let guessCount = 4;
  //The word to guess
  let password = "";

  //The start button
  const start = document.getElementById("start");

  start.addEventListener("click", () => {
    //When start button is pressed
    toggleClasses(document.getElementById("start-screen"), "hide", "show");
    toggleClasses(document.getElementById("game-screen"), "hide", "show");
    startGame();
  });

  const toggleClasses = (element, ...classnames) =>
    classnames.forEach(name => element.classList.toggle(name));

  const startGame = () => {
    // get random words and append them to the DOM
    const wordList = document.getElementById("word-list");

    // words is the array from word.js
    let randomWords = getRandomValues(words, wordCount);

    randomWords.forEach(function(word) {
      let li = document.createElement("li");
      li.innerText = word;
      wordList.appendChild(li);
    });

    // set a secret password and the guess count display
    password = getRandomValues(randomWords, 1)[0];
    setGuessCount(guessCount);

    // add update listener for clicking on a word
    wordList.addEventListener("click", updateGame);
  };

  // Takes an array and the number of values we want from that array
  let getRandomValues = (array, numberOfVals = wordCount) =>
    shuffle(array).slice(0, numberOfVals);

  const shuffle = array => {
    //Duplicate array
    let arrayCopy = [...array];

    for (let val1 = arrayCopy.length - 1; val1 > 0; val1--) {
      let val2 = Math.floor(Math.random() * (val1 + 1));

      [arrayCopy[val1], arrayCopy[val2]] = [arrayCopy[val2], arrayCopy[val1]];
    }
    return arrayCopy;
  };

  const setGuessCount = newCount => {
    guessCount = newCount;
    document.getElementById(
      "guesses-remaining"
    ).innerText = `Guesses remaining: ${guessCount}.`;
  };

  function updateGame(e) {
    if (e.target.tagName === "LI" && !e.target.classList.contains("disabled")) {
      // grab guessed word, check it against password, update view
      let guess = e.target.innerText;
      let similarityScore = compareWords(guess, password);
      e.target.classList.add("disabled");
      e.target.innerText = `${
        e.target.innerText
      } --> Matching Letters: ${similarityScore}`;
      setGuessCount(guessCount - 1);

      // check whether the game is over
      if (similarityScore === password.length) {
        toggleClasses(document.getElementById("winner"), "hide", "show");
        this.removeEventListener("click", updateGame);
      } else if (guessCount === 0) {
        toggleClasses(document.getElementById("loser"), "hide", "show");
        this.removeEventListener("click", updateGame);
      }
    }
  }

  function compareWords(word1, word2) {
    if (word1.length !== word2.length) throw "Words must have the same length";
    let count = 0;
    for (let i = 0; i < word1.length; i++) {
      if (word1[i] === word2[i]) count++;
    }
    return count;
  }
});
