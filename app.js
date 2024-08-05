const letters = document.querySelectorAll(".scoreboard-letter");
const loadingDiv = document.querySelector(".info-bar");
const ANSWER_LENGHT = 5;
const ROUNDS = 6;

async function init() {

    let currentGuess = '';
    let currentRow = 0;
    let isLoading = true;

    // get the word from the server
    const res = await fetch("https://words.dev-apis.com/word-of-the-day?random=1");
    const resObj = await res.json();
    const word = resObj.word.toUpperCase();
    const wordParts = word.split(""); // array of the correct answer
    let done = false;
    setLoading(false);
    isLoading = false;

    console.log(word);




    function addLetter(letter) {
        if (currentGuess.length < ANSWER_LENGHT) {
            // add letter to the end
            currentGuess += letter;
        } else {
            // lop off the last letter, replace the last letter
            currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
        }

        letters[ANSWER_LENGHT * currentRow + currentGuess.length - 1].innerText = letter;
    }

    async function commit() {
        if (currentGuess.length !== ANSWER_LENGHT) {
            // do nothing
            return;
        }

        // TODO validate the word

        // do all the marking as "correct" "close" or "wrong"

        const guessParts = currentGuess.split(""); // array of the current guess
        const map = makeMap(guessParts);
        console.log(map);


        for (let i = 0; i < ANSWER_LENGHT; i++) {
            // mark as correct
            if (guessParts[i] === wordParts[i]) {
                letters[currentRow * ANSWER_LENGHT + i].classList.add("correct");
                map[guessParts[i]]--;
            }
        }

        for (let i = 0; i < ANSWER_LENGHT; i++) {
            if (guessParts[i] === wordParts[i]) {
                // do nothing, we already marked it as correct
            } else if (wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0) {
                // mark as close
                letters[currentRow * ANSWER_LENGHT + i].classList.add("close");
                map[guessParts[i]]--;
            } else {
                // mark as wrong
                letters[currentRow * ANSWER_LENGHT + i].classList.add("wrong");
            }
        }
        currentRow++;
        
        if (currentGuess === word) {
            // win
            alert('You win! 😁');
            done = true;
            return;
        } else if (currentRow === ROUNDS) {
            // lose
            alert(`You lose, the word was ${word} 🥵`);
            done = true;
        }
        currentGuess = '';
    }

    function backspace() {
        currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        letters[ANSWER_LENGHT * currentRow + currentGuess.length].innerText = "";
    }

    document.addEventListener('keydown', function handleKeyPress (event) {

        if (done || isLoading) {
            // do nothing
            return;
        }

        const action = event.key;

        //console.log(action);

        if (action === 'Enter') {
            commit();
        } else if (action === 'Backspace') {
            backspace();
        } else if (isLetter(action)) {
            addLetter(action.toUpperCase());
        } else {
            // do nothing
        }
    })
}


function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function setLoading(isLoading) {
    // if it is loading, show the loading div, otherwise hide it
    loadingDiv.classList.toggle("hidden", !isLoading);
}

function makeMap(array) {
    const obj = {};
    for (let i = 0; i < array.length; i++) {
        const letter = array[i];
        if (obj[letter]) {
            obj[letter]++;
        } else {
            obj[letter] = 1;
        }
    }
    return obj;
}

init();
