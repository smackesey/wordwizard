// ########################
// ##### SIDEBAR
// ########################

import { useRecoilState, useRecoilValue } from 'recoil';
import { KEYMAPS } from './keymaps';
import { Word } from './phonograms';
import { SettingsSelect, SettingsSlider, SettingsToggle } from './settings';
import { letterModeState, letterWaveSpeedState, useUppercaseState, wordListState } from './state';
import { wordsPerRoundState } from './state';
import { numRoundsState } from './state';
import { demeritLimitState } from './state';
import { keymapKeyState } from './state';
import { completedWordsState } from './state';
import { wordListKeyState } from './state';
import { wordIndexState } from './state';
import { WORD_LISTS } from './words';

export function Sidebar() {
  const [wordIndex, setWordIndex] = useRecoilState(wordIndexState);
  const [wordListKey, setWordListKey] = useRecoilState(wordListKeyState);
  const completedWords = useRecoilValue(completedWordsState);
  const [useUppercase, setUseUppercase] = useRecoilState(useUppercaseState);
  const [demeritLimit, setDemeritLimit] = useRecoilState(demeritLimitState);
  const [numRounds, setNumRounds] = useRecoilState(numRoundsState);
  const [wordsPerRound, setWordsPerRound] = useRecoilState(wordsPerRoundState);
  const [keymapKey, setKeymapKey] = useRecoilState(keymapKeyState);
  const wordList = useRecoilValue(wordListState);
  const [letterWaveSpeed, setLetterWaveSpeed] = useRecoilState(letterWaveSpeedState);
  const [letterMode, setLetterMode] = useRecoilState(letterModeState);

  return (
    <div className="bg-gray-300 p-2 w-1/4 flex flex-col">
      <div className="text-5xl font-bold mb-2">Words</div>
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
      <div className="flex flex-col mt-2">
        <SettingsSelect
          settingsKey="wordListKey"
          label="Word list"
          value={wordListKey}
          setValue={setWordListKey}
          options={Array.from(WORD_LISTS.keys())}
        />
        <SettingsToggle
          settingsKey="letterMode"
          label="Letter mode"
          value={letterMode}
          setValue={setLetterMode}
        />
        <SettingsToggle
          settingsKey="useUppercase"
          label="Use uppercase"
          value={useUppercase}
          setValue={setUseUppercase}
        />
        <SettingsSlider
          settingsKey="demeritLimit"
          label="Demerit limit"
          value={demeritLimit}
          setValue={setDemeritLimit}
        />
        <SettingsSlider
          settingsKey="numRounds"
          label="# Rounds"
          value={numRounds}
          setValue={setNumRounds}
          min={1}
        />
        <SettingsSlider
          settingsKey="wordsPerRound"
          label="Words / round"
          value={wordsPerRound}
          setValue={setWordsPerRound}
        />
        <SettingsSlider
          settingsKey="letterWaveSpeed"
          label="Letter wave speed"
          value={letterWaveSpeed}
          setValue={setLetterWaveSpeed}
          min={1}
          max={10}
        />
        <SettingsSelect
          settingsKey="keymapKey"
          label="Keymap"
          value={keymapKey}
          setValue={setKeymapKey}
          options={Array.from(KEYMAPS.keys())}
        />
      </div>
    </div>
  );
}
