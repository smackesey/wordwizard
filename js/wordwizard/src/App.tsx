import React from 'react';
import './App.css';
import {WORD_LISTS} from './words';

const CURSOR_CHAR = "\u261D";

const VOWELS = ["a", "e", "i", "o", "u"];

const UNICORN_DURATION = 1000;

type Mode = "letter" | "word";
type Direction = "forward" | "backward";

const ACTIONS: Map<string, string> = new Map([
  ["c", "toggle-completed"],
  ["h", "previous-letter"],
  ["s", "next-letter"],
  ["n", "previous-uncompleted-word"],
  ["t", "next-uncompleted-word"],
  ["v", "previous-word"],
  ["w", "next-word"],
  ["r", "toggle-mode"],
  ["f", "reset"],
]);

function getBgClass(character: string) {
  if (character === " ") {
    return '';
  } else if (character === CURSOR_CHAR) {
    return 'bg-yellow-50';
  } else if (VOWELS.includes(character)) {
    return "bg-red-500";
  } else {
    return "bg-blue-500";
  }
}

function Tile({ letter, dimmed }: { letter: string; dimmed?: boolean }) {
  const bgClass = getBgClass(letter);
  const opacityClass = dimmed ? "bg-opacity-20 text-gray-500" : "";
  const fontClass = letter === CURSOR_CHAR ? "cursor" : "";
  return (
    <div className={`${bgClass} ${opacityClass} ${fontClass} text-5xl rounded-md flex items-center justify-center w-16 h-16`}>{letter}</div>
  );
}

function Key({ character }: { character: string }) {
  return (
    <div className="bg-gray-200 text-lg border border-black rounded-md flex items-center justify-center w-6 h-6">{character}</div>
  );
}

function Word({ word, dimmed }: { word: string; dimmed?: boolean }) {
  return (
    <div className="flex font-mono space-x-2 > *">
      {word.split("").map((letter, i) => (
        <Tile letter={letter} dimmed={dimmed} key={i}/>
      ))}
    </div>
  );
}

function Sidebar({wordIndex, wordListKey, setWordListKey, completedWords}: {wordIndex: number; wordListKey: string; completedWords: string[]; setWordListKey: (wordListKey: string) => void}) {
  const wordList = WORD_LISTS.get(wordListKey)!;
  return (
    <div className="bg-gray-300 p-2 w-1/4 flex flex-col">
      <div className="text-5xl font-bold mb-2">Remaining words</div>
      <div className="space-y-2 > *">
        {wordList.map((word, i) => {
          const borderClasses = i === wordIndex ? "border-2 border-black rounded-md" : "";
          return (
            <div className={`p-1 ${borderClasses}`} key={i}>
              <Word word={word} dimmed={completedWords.includes(word)} />
            </div>
          );
        })}
      </div>
      <div className="h-0 flex-grow"></div>
      <UpwardDropdown items={Array.from(WORD_LISTS.keys())} setItem={setWordListKey} title="Word lists"/>
    </div>
  );
}

function UpwardDropdown({items, setItem, title}: { items: string[]; setItem: (wordListName: string) => void; title: string }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);


  return (
    <div className="dropdown-container p-2 flex flex-col space-y-2 > *">
      {isOpen && (
        <div className="dropdown-content">
          {items.map((item, i) => (
            <div className="bg-gray-300 hover:border-black hover:border hover:cursor-pointer p-2" onClick={() => {setItem(item); toggleDropdown();}} key={i}>
              {item}
            </div>
          ))}
        </div>
      )}
      <button className="border-black border-2 rounded-md p-2" onClick={toggleDropdown}>{title}</button>
    </div>
  );
}


function Arrow() {
  return (
  <div className="arrow-container bg-white self-start rounded-md w-16 h-16 flex items-center p-2">
    <div className="h-1 flex-grow bg-black -mr-2" />
    <div className="text-2xl">&#9654;</div>
  </div>
  );
}

function Unicorn({ onFinished }: { onFinished?: () => void}) {
  const [isAnimating, setIsAnimating] = React.useState(true);

  React.useEffect(() => {
    const animationDuration = UNICORN_DURATION; // Duration in milliseconds (5 seconds in this case)
    
    const timer = setTimeout(() => {
      setIsAnimating(false);
      if (onFinished) {
        onFinished();
      }
    }, animationDuration);

    return () => clearTimeout(timer);
  }, [onFinished]);

  if (!isAnimating) {
    return null; // Don't render anything when the animation is finished
  }

  return (
    <div className="arc-container">
      <img src="unicorn.webp" alt="Unicorn" className="arc-image"/>
    </div>
  );
}

function Board({mode, word, letterIndex, score, showUnicorn, setShowUnicorn}: {mode: Mode; word: string; letterIndex: number; score: number; showUnicorn: boolean; setShowUnicorn: (show: boolean) => void}) {
  const cursorWord = ' '.repeat(letterIndex) + CURSOR_CHAR + ' '.repeat(word.length - letterIndex - 1);

  return (
    <div className="relative bg-gray-500 flex-1 flex items-center justify-center" >
      <div className="flex flex-col space-y-2 > *">
        <Word word={word} />
        {mode === "letter" ? (
          <Word word={cursorWord} />
        ) : (
          <Arrow />
        )}
      </div>
      {showUnicorn && <Unicorn onFinished={() => setShowUnicorn(false)} />}
    </div>
  );
}

function cycleUncompletedWordIndex(wordList: string[], completedWords: string[], wordIndex: number, direction: Direction) {
  if (completedWords.length === wordList.length) {
    return undefined;
  } else {
    let newIndex = cycleWordIndex(wordList, wordIndex, direction)!;
    while (completedWords.includes(wordList[newIndex])) {
      newIndex = cycleWordIndex(wordList, newIndex, direction)!;
    }
    return newIndex;
  }
}

function cycleWordIndex(wordList: string[], wordIndex: number, direction: Direction) {
  if (direction === "forward") {
    return wordIndex === wordList.length - 1 ? 0 : wordIndex + 1;
  } else {
    return wordIndex === 0 ? wordList.length - 1 : wordIndex - 1;
  }
}

function HelpModal() {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-0 right-0 p-3 flex flex-col items-end space-y-2 > *">
      {isOpen && (
        <div className="border-2 border-black rounded-md p-2 bg-gray-400">
          <div className="space-y-1 > *">
            <p>Key bindings</p>
            {Array.from(ACTIONS.entries()).map(([key, action]) => (
              <div key={key} className="flex items-center space-x-2 > *">
                <Key character={key} />
                <div>{action}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <button className="rounded-full border-black border-2 w-8 h-8 font-bold" onClick={toggleModal}>?</button>
    </div>
  );
}

function App() {
  const [wordListKey, setWordListKey] = React.useState(WORD_LISTS.keys().next().value);
  const [mode, setMode] = React.useState<Mode>("letter");
  const [wordIndex, setWordIndex] = React.useState(0);
  const [letterIndex, setLetterIndex] = React.useState(0);
  const [completedWords, setCompletedWords] = React.useState<string[]>([]);
  const [showUnicorn, setShowUnicorn] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const wordList = WORD_LISTS.get(wordListKey)!;
      const word = wordList[wordIndex];
      console.log("word is", word);
      const action = ACTIONS.get(event.key);
      console.log("action is", action);
      if (action === "toggle-mode") {
        setLetterIndex(0);
        setMode(mode === "letter" ? "word" : "letter");
      } else if (action === "next-letter") {
        const newPosition = letterIndex === word.length - 1 ? 0 : letterIndex + 1;
        setLetterIndex(newPosition);
      } else if (action === "previous-letter") {
        const newPosition = letterIndex === 0 ? word.length - 1 : letterIndex - 1;
        setLetterIndex(newPosition);
      } else if (action === "next-uncompleted-word") {
        const newWordIndex = cycleUncompletedWordIndex(wordList, completedWords, wordIndex, 'forward')!;
        setWordIndex(newWordIndex);
        setLetterIndex(0);
      } else if (action === "next-word") {
        const newWordIndex = cycleWordIndex(wordList, wordIndex, 'forward')!;
        setWordIndex(newWordIndex);
        setLetterIndex(0);
      } else if (action === "previous-uncompleted-word") {
        const newWordIndex = cycleUncompletedWordIndex(wordList, completedWords, wordIndex, 'backward')!;
        setWordIndex(newWordIndex);
        setLetterIndex(0);
      } else if (action === "previous-word") {
        const newWordIndex = cycleWordIndex(wordList, wordIndex, 'backward')!;
        setWordIndex(newWordIndex);
        setLetterIndex(0);
      } else if (action === "toggle-completed") {
        if (completedWords.includes(word)) {
          setCompletedWords(completedWords.filter((completedWord) => completedWord !== word));
        } else {
          setCompletedWords([...completedWords, wordList[wordIndex]]);
          const newWordIndex = cycleUncompletedWordIndex(wordList, completedWords, wordIndex, 'backward')!;
          setShowUnicorn(true);
          setTimeout(() => {
            setWordIndex(newWordIndex);
            setLetterIndex(0);
          }, UNICORN_DURATION);
        }
      } else if (action === "reset") {
        setCompletedWords([]);
        setWordIndex(0);
        setLetterIndex(0);
      }
    };
    
    // Attach the event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [wordListKey, mode, wordIndex, letterIndex, completedWords]);

  const wordList = WORD_LISTS.get(wordListKey)!;
  return (
    <div className="flex w-screen h-screen bg-black">
      <Sidebar wordIndex={wordIndex} wordListKey={wordListKey} setWordListKey={setWordListKey} completedWords={completedWords}/>
      <Board mode={mode} word={wordList[wordIndex]} letterIndex={letterIndex} score={5} showUnicorn={showUnicorn} setShowUnicorn={setShowUnicorn}/>
      <HelpModal />
    </div>
  );
}

export default App;
