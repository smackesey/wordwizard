// ########################
// ##### STATE
// ########################

import React from 'react';
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import { ADD_DEMERIT_SOUND, MOVE_LETTER_SOUND, playSound, WORD_COMPLETE_SOUND } from './audio';
import { KeyboardLayout, KEYBOARD_LAYOUTS, Keymap, KEYMAPS } from './keymaps';
import { localStorageGet } from './settings';
import { WordListRecord, WORD_LISTS } from './words';

// ****************************************************************************
// ***** TYPES ****************************************************************

export type GameStatus = 'in-progress' | 'lose' | 'win';

// *****************************************************************************
// ***** SETTINGS **************************************************************

export const keymapKeyState = atom<Keymap>({
  key: 'keymapKey',
  default: localStorageGet('keymapKey', 'qwerty'),
});
export const useUppercaseState = atom<boolean>({
  key: 'useUppercase',
  default: localStorageGet('useUppercase', false),
});
export const letterModeState = atom<boolean>({ key: 'letterMode', default: false });
export const demeritLimitState = atom<number>({
  key: 'demeritLimit',
  default: localStorageGet('demeritLimit', 5),
});
export const numRoundsState = atom<number>({
  key: 'numRounds',
  default: localStorageGet('numRounds', 3),
});
export const wordsPerRoundState = atom<number>({
  key: 'wordsPerRound',
  default: localStorageGet('wordsPerRound', 5),
});
export const helpModalOpenState = atom<boolean>({ key: 'helpModalOpen', default: false });
export const wordListKeyState = atom<string>({
  key: 'wordListKey',
  default: localStorageGet('wordListKey', 'short-vowel-dalle'),
});
export const inLetterWaveState = atom<boolean>({ key: 'inLetterWave', default: false });
export const letterWaveSpeedState = atom<number>({
  key: 'letterWaveSpeed',
  default: localStorageGet('letterWaveSpeed', 5),
});

// ----- TRANSIENT

export const completedWordRecordsState = atom<WordListRecord[]>({
  key: 'completedWordRecords',
  default: [],
});
export const demeritCountState = atom<number>({ key: 'demeritCount', default: 0 });
export const letterIndexState = atom<number>({ key: 'letterIndex', default: 0 });
export const scoreboardSelectedIndexState = atom<number | undefined>({
  key: 'scoreboardSelectedIndex',
  default: undefined,
});
export const showDemeritImageState = atom<boolean>({ key: 'showDemeritImage', default: false });
export const showWordImageState = atom<boolean>({ key: 'showWordImage', default: false });
export const wordIndexState = atom<number>({ key: 'wordIndex', default: 0 });

// ----- COMPUTED

export const completedWordsState = selector<string[]>({
  key: 'completedWords',
  get: ({ get }) => {
    const completedWordRecords = get(completedWordRecordsState);
    return completedWordRecords.map((record) => record.word);
  },
});
export const roundIndexState = selector<number>({
  key: 'roundIndex',
  get: ({ get }) => {
    const completedWords = get(completedWordsState);
    const numRounds = get(numRoundsState);
    const wordsPerRound = get(wordsPerRoundState);
    return Math.min(Math.floor(completedWords.length / wordsPerRound), numRounds - 1);
  },
});
export const wordListState = selector<WordListRecord[]>({
  key: 'wordList',
  get: ({ get }) => {
    const wordListKey = get(wordListKeyState);
    const completedWords = get(completedWordsState);
    const fullWordList = WORD_LISTS.get(wordListKey)!;
    return fullWordList.filter((entry) => !completedWords.includes(entry.word));
  },
});
export const wordRecordState = selector<WordListRecord>({
  key: 'word',
  get: ({ get }) => {
    const wordList = get(wordListState);
    const wordIndex = get(wordIndexState);
    return wordList[wordIndex];
  },
});
export const keyboardLayoutState = selector<KeyboardLayout>({
  key: 'keyboardLayout',
  get: ({ get }) => {
    const keymapKey = get(keymapKeyState);
    return KEYBOARD_LAYOUTS.get(keymapKey)!;
  },
});
export const keymapState = selector<Map<string, string>>({
  key: 'keymap',
  get: ({ get }) => {
    const keymapKey = get(keymapKeyState);
    return KEYMAPS.get(keymapKey)!;
  },
});
export const gameStatusState = selector<GameStatus>({
  key: 'gameStatus',
  get: ({ get }) => {
    const demeritCount = get(demeritCountState);
    const demeritLimit = get(demeritLimitState);
    const completedWords = get(completedWordsState);
    const totalNumWords = get(totalNumWordsState);
    if (demeritCount >= demeritLimit) {
      return 'lose';
    } else if (completedWords.length === totalNumWords) {
      return 'win';
    } else {
      return 'in-progress';
    }
  },
});
export const totalNumWordsState = selector<number>({
  key: 'totalNumWords',
  get: ({ get }) => {
    const wordListKey = get(wordListKeyState);
    const fullWordList = WORD_LISTS.get(wordListKey)!;
    const numRounds = get(numRoundsState);
    const wordsPerRound = get(wordsPerRoundState);
    const userSpecified = numRounds * wordsPerRound;
    return Math.min(fullWordList.length, userSpecified);
  },
});
export const tileSizeState = selector<string>({
  key: 'tileSize',
  get: ({ get }) => {
    const numRounds = get(numRoundsState);
    const num = Math.min(Math.floor(40 / (numRounds + 1)), 8) - 1;
    return `${num}vh`;
  },
});
export const scoreboardSelectedWordRecordState = selector<WordListRecord | undefined>({
  key: 'scoreboardSelectedWordRecord',
  get: ({ get }) => {
    const scoreboardSelectedIndex = get(scoreboardSelectedIndexState);
    const completedWords = get(completedWordRecordsState);
    return scoreboardSelectedIndex !== undefined
      ? completedWords[scoreboardSelectedIndex]
      : undefined;
  },
});
export const showFullBoardImageState = selector<boolean>({
  key: 'showFullBoardImage',
  get: ({ get }) => {
    return get(showDemeritImageState) || get(scoreboardSelectedIndexState) !== undefined;
  },
});

// ****************************************************************************
// ***** STATE TRANSITIONS ****************************************************

export function KeyboardListener() {
  const keymapKey = useRecoilValue(keymapKeyState);
  const wordListKey = useRecoilValue(wordListKeyState);
  const [wordIndex, setWordIndex] = useRecoilState(wordIndexState);
  const [letterIndex, setLetterIndex] = useRecoilState(letterIndexState);
  const [completedWordRecords, setCompletedWordRecords] = useRecoilState(completedWordRecordsState);
  const completedWords = useRecoilValue(completedWordsState);
  const [showWordImage, setShowWordImage] = useRecoilState(showWordImageState);
  const [demeritCount, setDemeritCount] = useRecoilState(demeritCountState);
  const [showDemeritImage, setShowDemeritImage] = useRecoilState(showDemeritImageState);
  const demeritLimit = useRecoilValue(demeritLimitState);
  const wordsPerRound = useRecoilValue(wordsPerRoundState);
  const numRounds = useRecoilValue(numRoundsState);
  const wordList = useRecoilValue(wordListState);
  const [inLetterWave, setInLetterWave] = useRecoilState(inLetterWaveState);
  const letterWaveSpeed = useRecoilValue(letterWaveSpeedState);
  const letterMode = useRecoilValue(letterModeState);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const word = wordList[wordIndex].word;
      const keymap = KEYMAPS.get(keymapKey)!;
      const action = keymap.get(event.key);

      if (action === 'add-demerit') {
        if (showDemeritImage) {
          setShowDemeritImage(false);
          setDemeritCount(demeritCount + 1);
        } else {
          playSound(ADD_DEMERIT_SOUND);
          setShowDemeritImage(true);
        }
      } else if (action === 'letter-wave') {
        if (!inLetterWave) {
          setInLetterWave(true);
          setLetterIndex(word.length);
          letterWave(word.length, setLetterIndex, setInLetterWave, letterWaveSpeed);
        }
      } else if (action === 'next-letter') {
        if (letterMode) {
          const newPosition = letterIndex >= word.length - 1 ? 0 : letterIndex + 1;
          setLetterIndex(newPosition);
          playSound(MOVE_LETTER_SOUND);
        }
      } else if (action === 'previous-letter') {
        if (letterMode) {
          const newPosition = letterIndex <= 0 ? word.length - 1 : letterIndex - 1;
          setLetterIndex(newPosition);
          playSound(MOVE_LETTER_SOUND);
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
      } else if (action === 'next-word') {
        const newWordIndex = cycleWordIndex(wordList, wordIndex, 'forward')!;
        setWordIndex(newWordIndex);
        setLetterIndex(0);
      } else if (action === 'previous-uncompleted-word') {
        const newWordIndex = cycleUncompletedWordIndex(
          wordList,
          completedWords,
          wordIndex,
          'backward',
        )!;
        setWordIndex(newWordIndex);
        setLetterIndex(0);
      } else if (action === 'previous-word') {
        const newWordIndex = cycleWordIndex(wordList, wordIndex, 'backward')!;
        setWordIndex(newWordIndex);
        setLetterIndex(0);
      } else if (action === 'toggle-completed') {
        if (showWordImage) {
          setShowWordImage(false);
          setCompletedWordRecords([...completedWordRecords, wordList[wordIndex]]);
          setLetterIndex(0);
        } else if (completedWords.includes(word)) {
          setCompletedWordRecords(
            completedWordRecords.filter((completedWordRecord) => completedWordRecord.word !== word),
          );
        } else {
          playSound(WORD_COMPLETE_SOUND);
          setShowWordImage(true);
        }
      } else if (action === 'reset') {
        setCompletedWordRecords([]);
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
    wordIndex,
    letterIndex,
    completedWords,
    completedWordRecords,
    keymapKey,
    showWordImage,
    showDemeritImage,
    setShowDemeritImage,
    setCompletedWordRecords,
    setWordIndex,
    setShowWordImage,
    setLetterIndex,
    demeritCount,
    setDemeritCount,
    demeritLimit,
    wordsPerRound,
    numRounds,
    wordList,
    inLetterWave,
    setInLetterWave,
    letterWaveSpeed,
    letterMode,
  ]);

  return null;
}

type Direction = 'forward' | 'backward';

export const LETTER_WAVE_SPEED_BASE = 2000;

function letterWave(
  length: number,
  setLetterIndex: (i: number) => void,
  setInLetterWave: (x: boolean) => void,
  speed: number,
) {
  let counter = 0;
  const waveFn = () => {
    setLetterIndex(counter);
    counter++;
    if (counter <= length) {
      setTimeout(waveFn, LETTER_WAVE_SPEED_BASE / speed);
    } else {
      setInLetterWave(false);
    }
  };
  waveFn();
}

function cycleUncompletedWordIndex(
  wordList: WordListRecord[],
  completedWords: string[],
  wordIndex: number,
  direction: Direction,
) {
  if (completedWords.length === wordList.length) {
    return undefined;
  } else {
    let newIndex = cycleWordIndex(wordList, wordIndex, direction)!;
    while (completedWords.includes(wordList[newIndex].word)) {
      newIndex = cycleWordIndex(wordList, newIndex, direction)!;
    }
    return newIndex;
  }
}

function cycleWordIndex(wordList: WordListRecord[], wordIndex: number, direction: Direction) {
  if (direction === 'forward') {
    return wordIndex === wordList.length - 1 ? 0 : wordIndex + 1;
  } else {
    return wordIndex === 0 ? wordList.length - 1 : wordIndex - 1;
  }
}
