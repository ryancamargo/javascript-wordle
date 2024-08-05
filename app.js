const letters = document.querySelectorAll(".scoreboard-letter");
const loadingDiv = document.querySelector(".info-bar");
const ANSWER_LENGHT = 5;

async function init() {

    let currentGuess = '';
    let currentRow = 0;

    // get the word from the server
    const res = await fetch("https://words.dev-apis.com/word-of-the-day?random=1");
    const resObj = await res.json();
    const word = resObj.word.toUpperCase();
    const wordParts = word.split(""); // array of the correct answer
    setLoading(false);

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

        // TODO do all the marking as "correct" "close" or "wrong"

        const guessParts = currentGuess.split(""); // array of the current guess

        for (let i = 0; i < ANSWER_LENGHT; i++) {
            // mark as correct
            if (guessParts[i] === wordParts[i]) {
                letters[currentRow * ANSWER_LENGHT + i].classList.add("correct");
            }
        }

        for (let i = 0; i < ANSWER_LENGHT; i++) {
            if (guessParts[i] === wordParts[i]) {
                // do nothing, we already marked it as correct
            } else if (wordParts.includes(guessParts[i]) /* TODO make this more accurate */) {
                letters[currentRow * ANSWER_LENGHT + i].classList.add("close");
            } else {
                letters[currentRow * ANSWER_LENGHT + i].classList.add("wrong");
            }
        }

        // TODO did they win or lose?

        currentRow++;
        currentGuess = '';
    }

    function backspace() {
        currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        letters[ANSWER_LENGHT * currentRow + currentGuess.length].innerText = "";
    }

    document.addEventListener('keydown', function handleKeyPress (event) {
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

init();
