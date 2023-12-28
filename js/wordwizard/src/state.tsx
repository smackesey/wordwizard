// ########################
// ##### STATE
// ########################

import React from 'react';
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import { ADD_DEMERIT_SOUND, LETTER_FORWARD_SOUND, playSound, WORD_COMPLETE_SOUND } from './audio';
import { KeyboardLayout, KEYBOARD_LAYOUTS, Keymap, KEYMAPS } from './keymaps';
import { localStorageGet } from './settings';
import { WORD_LISTS } from './words';

// ****************************************************************************
// ***** TYPES ****************************************************************

export type Mode = 'letter' | 'word';
export type GameStatus = 'in-progress' | 'lose' | 'win';

// *****************************************************************************
// ***** SETTINGS **************************************************************

export const keymapKeyState = atom<Keymap>({
  key: 'keymapKey',
  default: localStorageGet('keymapKey', 'qwerty'),
});
export const showCompletedState = atom<boolean>({
  key: 'showCompleted',
  default: localStorageGet('showCompleted', false),
});
export const useUppercaseState = atom<boolean>({
  key: 'useUppercase',
  default: localStorageGet('useUppercase', false),
});
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
  default: localStorageGet('wordListKey', 'images'),
});

// ----- TRANSIENT

export const arrowAnimationKeyState = atom<number>({ key: 'arrowAnimationKey', default: 0 });
export const completedWordsState = atom<string[]>({ key: 'completedWords', default: [] });
export const demeritCountState = atom<number>({ key: 'demeritCount', default: 0 });
export const letterIndexState = atom<number>({ key: 'letterIndex', default: 0 });
export const modeState = atom<Mode>({ key: 'mode', default: 'letter' });
export const showDemeritImageState = atom<boolean>({ key: 'showDemeritImage', default: false });
export const showWordImageState = atom<boolean>({ key: 'showWordImage', default: false });
export const wordIndexState = atom<number>({ key: 'wordIndex', default: 0 });

// ----- COMPUTED

export const roundIndexState = selector<number>({
  key: 'roundIndex',
  get: ({ get }) => {
    const completedWords = get(completedWordsState);
    const numRounds = get(numRoundsState);
    const wordsPerRound = get(wordsPerRoundState);
    return Math.min(Math.floor(completedWords.length / wordsPerRound), numRounds - 1);
  },
});
export const wordListState = selector<string[]>({
  key: 'wordList',
  get: ({ get }) => {
    const wordListKey = get(wordListKeyState);
    const completedWords = get(completedWordsState);
    const showCompleted = get(showCompletedState);
    const fullWordList = WORD_LISTS.get(wordListKey)!;
    return showCompleted
      ? fullWordList
      : fullWordList.filter((word) => !completedWords.includes(word));
  },
});
export const wordState = selector<string>({
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
    const numRounds = get(numRoundsState);
    const wordsPerRound = get(wordsPerRoundState);
    if (demeritCount >= demeritLimit) {
      return 'lose';
    } else if (completedWords.length === numRounds * wordsPerRound) {
      return 'win';
    } else {
      return 'in-progress';
    }
  },
});

// ****************************************************************************
// ***** STATE TRANSITIONS ****************************************************

export function KeyboardListener() {
  const keymapKey = useRecoilValue(keymapKeyState);
  const wordListKey = useRecoilValue(wordListKeyState);
  const [mode, setMode] = useRecoilState(modeState);
  const [wordIndex, setWordIndex] = useRecoilState(wordIndexState);
  const [letterIndex, setLetterIndex] = useRecoilState(letterIndexState);
  const [completedWords, setCompletedWords] = useRecoilState(completedWordsState);
  const showCompleted = useRecoilValue(showCompletedState);
  const [showWordImage, setShowWordImage] = useRecoilState(showWordImageState);
  const [arrowAnimationKey, setArrowAnimationKey] = useRecoilState(arrowAnimationKeyState);
  const [demeritCount, setDemeritCount] = useRecoilState(demeritCountState);
  const [showDemeritImage, setShowDemeritImage] = useRecoilState(showDemeritImageState);
  const demeritLimit = useRecoilValue(demeritLimitState);
  const wordsPerRound = useRecoilValue(wordsPerRoundState);
  const numRounds = useRecoilValue(numRoundsState);
  const wordList = useRecoilValue(wordListState);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const word = wordList[wordIndex];
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
      } else if (action === 'word-mode') {
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
          setShowWordImage(false);
          setCompletedWords([...completedWords, wordList[wordIndex]]);
          if (showCompleted) {
            const newWordIndex = cycleUncompletedWordIndex(
              wordList,
              completedWords,
              wordIndex,
              'forward',
            )!;
            setWordIndex(newWordIndex);
          }
          setLetterIndex(0);
          setMode('letter');
        } else if (completedWords.includes(word)) {
          setCompletedWords(completedWords.filter((completedWord) => completedWord !== word));
        } else {
          playSound(WORD_COMPLETE_SOUND);
          setShowWordImage(true);
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
    showDemeritImage,
    setShowDemeritImage,
    setArrowAnimationKey,
    setCompletedWords,
    setWordIndex,
    setShowWordImage,
    setLetterIndex,
    setMode,
    demeritCount,
    setDemeritCount,
    demeritLimit,
    wordsPerRound,
    numRounds,
    wordList,
  ]);

  return null;
}

type Direction = 'forward' | 'backward';

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