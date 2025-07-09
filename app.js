/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const { useState, useEffect } =React;

function App() {
   const WORDS =["banana", "guitar", "purple", "window", "rocket", "tunnel", "planet", "school", "animal", "cookie"];

   const MAX_STRIKES =3;
   const MAX_PASSES =3;

  const savedState =JSON.parse(localStorage.getItem('scrambleGame')) || {};

  const [words, setWords] =useState(savedState.words || shuffle(WORDS));
  const [currentIndex, setCurrentIndex] =useState(savedState.currentIndex || 0);
  const [points, setPoints] =useState(savedState.points || 0);
  const [strikes, setStrikes] =useState(savedState.strikes || 0);
  const [passesLeft, setPassesLeft] = useState(savedState.passesLeft !== undefined ? savedState.passesLeft : MAX_PASSES);
  const [guess, setGuess] =useState("");
  const [message, setMessage] =useState("");
  const [gameOver, setGameOver] =useState(savedState.gameOver || false);

  useEffect(() => {
    localStorage.setItem('scrambleGame', JSON.stringify({
      words,
      currentIndex,
      points,
      strikes,
      passesLeft,
      gameOver,
    }));
  }, [words, currentIndex, points, strikes, passesLeft, gameOver]);

   const scrambledWord =words.length > 0 && currentIndex < words.length ? shuffle(words[currentIndex]) :"";
  function handleSubmit(e){
    e.preventDefault();
    if (gameOver || !guess.trim()) return;

    const currentWord = words[currentIndex];
    if (guess.toLowerCase() ===currentWord.toLowerCase()) {
      setMessage("Correct!");
      setPoints(points + 1);
      nextWord();
    } else {
      setMessage("Incorrect!");
      const newStrikes = strikes +1;
      setStrikes(newStrikes);
      if (newStrikes >=MAX_STRIKES) {
        setGameOver(true);
        setMessage("Game Over! You reached max strikes.");
      }
    }
    setGuess("");
  }

  function nextWord() {
    const nextIndex =currentIndex + 1;
    if (nextIndex >=words.length) {
      setGameOver(true);
      setMessage("Congratulations! You finished all words.");
    } else {
      setCurrentIndex(nextIndex);
      setMessage("");
    }
  }
    function handlePass() {
    if (gameOver) return;
    if (passesLeft <=0) {
      setMessage("No passes left!");
      return;
    }
    setPassesLeft(passesLeft -1);
    nextWord();
  }

    function handleRestart() {
    const shuffledWords =shuffle(WORDS);
    setWords(shuffledWords);
    setCurrentIndex(0);
    setPoints(0);
    setStrikes(0);
    setPassesLeft(MAX_PASSES);
    setMessage("");
    setGameOver(false);
    setGuess("");
    localStorage.removeItem('scrambleGame');
  }

  return (
    <div style={{ maxWidth: 400, margin: '20px auto', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h1> Welcome to Scramble</h1>
      {!gameOver && words.length > 0 && (
        <>
          <p><strong>Scrambled Word:</strong></p>
          <h2 style={{ letterSpacing: '0.1em' }}>{scrambledWord}</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={guess}
              onChange={e => setGuess(e.target.value)}
              placeholder="Type your guess"
              autoComplete="off"
              disabled={gameOver}
              style={{ padding: '8px', fontSize: '1em', borderRadius: '8px', border: '2px solid black', paddin: '9px' }}
            />
            <button type="submit" disabled={gameOver} style={{ marginLeft: 8, padding: '10px', backgroundColor: 'blue', border: '2px solid black', borderRadius: '8px' }}>Guess</button>
          </form>

          <button onClick={handlePass} disabled={passesLeft <= 0 || gameOver} style={{ marginTop: 15, border: '2px solid black',  backgroundColor: 'blue', padding: '10px', color:'white'}}>
            Pass ({passesLeft} left)
          </button>

          <p>{message}</p>
          <p>Points: {points} / Strikes: {strikes} / {MAX_STRIKES}</p>
          </>
      )}

      {gameOver && (
        <>
          <h2>Game Over</h2>
          <p>{message}</p>
          <p>Final Score: {points}</p>
          <button onClick={handleRestart}>Play Again</button>
        </>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.body).render(<App />);
