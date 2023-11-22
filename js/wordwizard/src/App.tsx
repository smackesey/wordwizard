import { motion } from 'framer-motion';
import React from 'react';
import './App.css';
import { Keymap, KEYMAPS } from './keymaps';
import { WORD_LISTS } from './words';

const CURSOR_CHAR = '\u261D';

const VOWELS = ['a', 'e', 'i', 'o', 'u'];

const UNICORN_DURATION = 1000;

type Mode = 'letter' | 'word';
type Direction = 'forward' | 'backward';

const LETTER_FORWARD_SOUND = new Audio('letter-forward.wav');
const WORD_COMPLETE_SOUND = new Audio('word-complete.mp3');

function playSound(sound: HTMLAudioElement) {
  // sound.currentTime = 0;
  if (sound === LETTER_FORWARD_SOUND) {
    sound.currentTime = 0.1;
  } else {
    sound.currentTime = 0;
  }
  sound.play();
}

function getBgClass(character: string) {
  if (character === ' ') {
    return '';
  } else if (character === CURSOR_CHAR) {
    return 'bg-yellow-50';
  } else if (VOWELS.includes(character.toLowerCase())) {
    return 'bg-red-500';
  } else {
    return 'bg-blue-500';
  }
}

function Scoreboard({ completedWords }: { completedWords: string[] }) {
  return (
    <div
      className="
      absolute bg-gray-400 p-3 rounded-lg border-2 border-black
      bottom-8 flex flex-col items-center justify-center w-4/5 space-y-2 > *
      "
    >
      <div className="text-3xl font-bold">Score: {completedWords.length}</div>
      <div className="flex flex-wrap space-x-2 > *">
        {completedWords.map((word, i) => (
          <motion.img
            src={`word-images/${word}.png`}
            alt="{word}"
            key={i}
            className={`my-1 mx-1 w-32 h-32 rounded-lg transition-opacity`}
            layoutId={`word-image-${word}`}
          />
        ))}
      </div>
    </div>
  );
}

function Tile({ letter, dimmed }: { letter: string; dimmed?: boolean }) {
  const bgClass = getBgClass(letter);
  const opacityClass = dimmed ? 'bg-opacity-20 text-gray-500' : '';
  const fontClass = letter === CURSOR_CHAR ? 'cursor' : '';
  return (
    <div
      className={`${bgClass} ${opacityClass} ${fontClass} text-5xl rounded-md flex items-center justify-center w-16 h-16`}
    >
      {letter}
    </div>
  );
}

function Key({ character }: { character: string }) {
  return (
    <div className="bg-gray-200 text-lg border border-black rounded-md flex items-center justify-center w-6 h-6">
      {character}
    </div>
  );
}

function Word({
  word,
  useUppercase,
  dimmed,
}: {
  word: string;
  useUppercase: boolean;
  dimmed?: boolean;
}) {
  return (
    <div className="flex font-mono space-x-2 > *">
      {word.split('').map((letter, i) => {
        const text = useUppercase ? letter.toUpperCase() : letter;
        return <Tile letter={text} dimmed={dimmed} key={i} />;
      })}
    </div>
  );
}

function Sidebar({
  wordIndex,
  setWordIndex,
  wordListKey,
  setWordListKey,
  completedWords,
  showCompleted,
  setShowCompleted,
  useUppercase,
  setUseUppercase,
}: {
  wordIndex: number;
  setWordIndex: (index: number) => void;
  wordListKey: string;
  completedWords: string[];
  setWordListKey: (wordListKey: string) => void;
  showCompleted: boolean;
  setShowCompleted: (show: boolean) => void;
  useUppercase: boolean;
  setUseUppercase: (use: boolean) => void;
}) {
  const wordList = getWordList(wordListKey, completedWords, showCompleted);
  return (
    <div className="bg-gray-300 p-2 w-1/4 flex flex-col">
      <div className="text-5xl font-bold mb-2">Remaining words</div>
      <div className="space-y-2 > * overflow-y-scroll">
        {wordList.map((word, i) => {
          const borderClasses = i === wordIndex ? 'border-2 border-black rounded-md' : '';
          return (
            <div className={`p-1 ${borderClasses}`} key={i} onClick={() => setWordIndex(i)}>
              <Word
                word={word}
                useUppercase={useUppercase}
                dimmed={completedWords.includes(word)}
              />
            </div>
          );
        })}
      </div>
      <div className="h-0 flex-grow"></div>
      <UpwardDropdown
        items={Array.from(WORD_LISTS.keys())}
        setItem={setWordListKey}
        title="Word lists"
      />
      <SettingsToggle label="Show completed" value={showCompleted} setValue={setShowCompleted} />
      <SettingsToggle label="Use uppercase" value={useUppercase} setValue={setUseUppercase} />
    </div>
  );
}

function SettingsToggle({
  label,
  value,
  setValue,
}: {
  label: string;
  value: boolean;
  setValue: (x: boolean) => void;
}) {
  return (
    <div className="flex justify-between">
      <div>{label}</div>
      <input type="checkbox" checked={value} onChange={(event) => setValue(event.target.checked)} />
    </div>
  );
}

function UpwardDropdown({
  items,
  setItem,
  title,
}: {
  items: string[];
  setItem: (wordListName: string) => void;
  title: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="dropdown-container p-2 flex flex-col space-y-2 > *">
      {isOpen && (
        <div className="dropdown-content">
          {items.map((item, i) => (
            <div
              className="bg-gray-300 hover:border-black hover:border hover:cursor-pointer p-2"
              onClick={() => {
                setItem(item);
                toggleDropdown();
              }}
              key={i}
            >
              {item}
            </div>
          ))}
        </div>
      )}
      <button className="border-black border-2 rounded-md p-2" onClick={toggleDropdown}>
        {title}
      </button>
    </div>
  );
}

function Arrow({ animationKey, letterIndex }: { animationKey: number; letterIndex: number }) {
  const arrowWidthClass = getArrowWidthClass(letterIndex);
  const style = {
    animationDuration: (letterIndex + 1) * 0.5 + 's',
  };
  console.log('using arrow width class', arrowWidthClass);
  return (
    <div className={`${arrowWidthClass}`}>
      <div
        key={animationKey}
        style={style}
        className={`arrow-container bg-white self-start rounded-md w-8 h-16 flex items-center p-2`}
      >
        <div className="h-1 flex-grow bg-black -mr-2" />
        <div className="text-2xl">&#9654;</div>
      </div>
    </div>
  );
}

// function Unicorn({ onFinished }: { onFinished?: () => void }) {
//   React.useEffect(() => {
//     const animationDuration = UNICORN_DURATION; // Duration in milliseconds (5 seconds in this case)
//
//     const timer = setTimeout(() => {
//       if (onFinished) {
//         onFinished();
//       }
//     }, animationDuration);
//
//     return () => clearTimeout(timer);
//   }, [onFinished]);
//
//   return (
//     <div className="arc-container">
//       <img src="unicorn.webp" alt="Unicorn" className="rounded-3xl arc-image" />
//     </div>
//   );
// }

function WordImage({ word, onFinished }: { word: string; onFinished?: () => void }) {
  return (
    <motion.img
      layoutId={`word-image-${word}`}
      src={`word-images/${word}.png`}
      alt={word}
      className="rounded-3xl h-[512px] fade-in"
    />
  );
}

function getArrowWidthClass(letterIndex: number) {
  const n = (letterIndex + 1) * 4 + letterIndex * 0.5;
  const x = `w-[${n}rem]`;

  // for some reason, w-[4rem] is not getting interpreted correctly
  return letterIndex === 0 ? 'w-16' : x;
}

function Board({
  mode,
  word,
  letterIndex,
  showWordImage,
  completedWords,
  arrowAnimationKey,
  useUppercase,
}: {
  mode: Mode;
  word: string;
  letterIndex: number;
  showWordImage: boolean;
  completedWords: string[];
  arrowAnimationKey: number;
  useUppercase: boolean;
}) {
  const cursorWord =
    ' '.repeat(letterIndex) + CURSOR_CHAR + ' '.repeat(word.length - letterIndex - 1);

  let secondRow;
  if (mode === 'letter') {
    secondRow = showWordImage ? (
      <div className="h-16" />
    ) : (
      <Word useUppercase={useUppercase} word={cursorWord} />
    );
  } else {
    secondRow = <Arrow letterIndex={letterIndex} animationKey={arrowAnimationKey} />;
  }

  return (
    <div className="relative bg-gray-500 flex-1 flex justify-center">
      <div className="flex flex-col space-y-2 > * items-center">
        <div className="h-[40%] w-[600px] flex flex-col items-center justify-center">
          {showWordImage && <WordImage word={word} />}
        </div>
        <div className="flex flex-col space-y-2 > *">
          <Word word={word} useUppercase={useUppercase} />
          {secondRow}
        </div>
      </div>
      <Scoreboard completedWords={completedWords} />
    </div>
  );
}

function cycleUncompletedWordIndex(
  wordList: string[],
  completedWords: string[],
  wordIndex: number,
  direction: Direction,
) {
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
  if (direction === 'forward') {
    return wordIndex === wordList.length - 1 ? 0 : wordIndex + 1;
  } else {
    return wordIndex === 0 ? wordList.length - 1 : wordIndex - 1;
  }
}

function HelpModal({ keymapKey }: { keymapKey: Keymap }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const keymap = KEYMAPS.get(keymapKey)!;
  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-0 right-0 p-3 flex flex-col items-end space-y-2 > *">
      {isOpen && (
        <div className="border-2 border-black rounded-md p-2 bg-gray-400">
          <div className="space-y-1 > *">
            <p>Key bindings</p>
            {Array.from(keymap.entries()).map(([key, action]) => (
              <div key={key} className="flex items-center space-x-2 > *">
                <Key character={key} />
                <div>{action}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <button
        className="rounded-full cursor-pointer bg-gray-400 border-black border-2 w-8 h-8 font-bold"
        onClick={toggleModal}
      >
        ?
      </button>
    </div>
  );
}

function KeymapToggle({
  keymapKey,
  setKeymapKey,
}: {
  keymapKey: Keymap;
  setKeymapKey: (keymapKey: Keymap) => void;
}) {
  return (
    <div
      className="fixed top-0 right-0 m-3 p-3 cursor-pointer bg-gray-400 rounded-md border-black border-2"
      onClick={() => setKeymapKey(keymapKey === 'QWERTY' ? 'DVORAK' : 'QWERTY')}
    >
      {keymapKey}
    </div>
  );
}

function getWordList(wordListKey: string, completedWords: string[], showCompleted: boolean) {
  const fullWordList = WORD_LISTS.get(wordListKey)!;
  return showCompleted
    ? fullWordList
    : fullWordList.filter((word) => !completedWords.includes(word));
}

function App() {
  const [keymapKey, setKeymapKey] = React.useState<Keymap>('DVORAK');
  const [wordListKey, setWordListKey] = React.useState(WORD_LISTS.keys().next().value);
  const [mode, setMode] = React.useState<Mode>('letter');
  const [wordIndex, setWordIndex] = React.useState(0);
  const [letterIndex, setLetterIndex] = React.useState(0);
  const [completedWords, setCompletedWords] = React.useState<string[]>([]);
  const [showCompleted, setShowCompleted] = React.useState(false);
  const [showWordImage, setShowUnicorn] = React.useState(false);
  const [arrowAnimationKey, setArrowAnimationKey] = React.useState(0);
  const [useUppercase, setUseUppercase] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const wordList = getWordList(wordListKey, completedWords, showCompleted);
      const word = wordList[wordIndex];
      const keymap = KEYMAPS.get(keymapKey)!;
      const action = keymap.get(event.key);

      if (action === 'word-mode') {
        // setLetterIndex(0);
        if (mode === 'word') {
          setArrowAnimationKey(arrowAnimationKey + 1);
        } else {
          setMode('word');
        }
      } else if (action === 'letter-mode') {
        if (mode === 'word') {
          setMode('letter');
        }
      } else if (action === 'next-letter') {
        const newPosition = letterIndex === word.length - 1 ? 0 : letterIndex + 1;
        setLetterIndex(newPosition);
        if (mode === 'word') {
          setArrowAnimationKey(arrowAnimationKey + 1);
        }
        playSound(LETTER_FORWARD_SOUND);
      } else if (action === 'previous-letter') {
        const newPosition = letterIndex === 0 ? word.length - 1 : letterIndex - 1;
        setLetterIndex(newPosition);
        if (mode === 'word') {
          setArrowAnimationKey(arrowAnimationKey + 1);
        }
      } else if (action === 'next-uncompleted-word') {
        const newWordIndex = cycleUncompletedWordIndex(
          wordList,
          completedWords,
          wordIndex,
          'forward',
        )!;
        setWordIndex(newWordIndex);
        setLetterIndex(0);
        setMode('letter');
      } else if (action === 'next-word') {
        const newWordIndex = cycleWordIndex(wordList, wordIndex, 'forward')!;
        setWordIndex(newWordIndex);
        setLetterIndex(0);
        setMode('letter');
      } else if (action === 'previous-uncompleted-word') {
        const newWordIndex = cycleUncompletedWordIndex(
          wordList,
          completedWords,
          wordIndex,
          'backward',
        )!;
        setWordIndex(newWordIndex);
        setLetterIndex(0);
        setMode('letter');
      } else if (action === 'previous-word') {
        const newWordIndex = cycleWordIndex(wordList, wordIndex, 'backward')!;
        setWordIndex(newWordIndex);
        setLetterIndex(0);
        setMode('letter');
      } else if (action === 'toggle-completed') {
        if (showWordImage) {
          setShowUnicorn(false);
          console.log('unicorn finished');
          setCompletedWords([...completedWords, wordList[wordIndex]]);
          console.log('completed words', completedWords);
          if (showCompleted) {
            const newWordIndex = cycleUncompletedWordIndex(
              wordList,
              completedWords,
              wordIndex,
              'forward',
            )!;
            console.log('new word index', newWordIndex);
            setWordIndex(newWordIndex);
          }
          setLetterIndex(0);
          setMode('letter');
        } else if (completedWords.includes(word)) {
          setCompletedWords(completedWords.filter((completedWord) => completedWord !== word));
        } else {
          playSound(WORD_COMPLETE_SOUND);
          setShowUnicorn(true);
        }
      } else if (action === 'reset') {
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
  }, [
    wordListKey,
    mode,
    wordIndex,
    letterIndex,
    completedWords,
    keymapKey,
    showCompleted,
    arrowAnimationKey,
    showWordImage,
  ]);

  const wordList = getWordList(wordListKey, completedWords, showCompleted);

  return (
    <div className="flex w-screen h-screen bg-black overflow-hidden">
      <Sidebar
        wordIndex={wordIndex}
        setWordIndex={setWordIndex}
        wordListKey={wordListKey}
        setWordListKey={setWordListKey}
        showCompleted={showCompleted}
        setShowCompleted={setShowCompleted}
        completedWords={completedWords}
        useUppercase={useUppercase}
        setUseUppercase={setUseUppercase}
      />
      <Board
        mode={mode}
        word={wordList[wordIndex]}
        letterIndex={letterIndex}
        showWordImage={showWordImage}
        completedWords={completedWords}
        arrowAnimationKey={arrowAnimationKey}
        useUppercase={useUppercase}
      />
      <HelpModal keymapKey={keymapKey} />
      <KeymapToggle keymapKey={keymapKey} setKeymapKey={setKeymapKey} />
    </div>
  );
}

export default App;
