// ########################
// ##### BOARD
// ########################

import { motion } from 'framer-motion';

import { useRecoilValue } from 'recoil';
import { playSound, VICTORY_SONG } from './audio';
import { HelpModal } from './HelpModal';
import { Word } from './phonograms';
import { Scoreboard } from './Scoreboard';
import {
  demeritCountState,
  GameStatus,
  gameStatusState,
  helpModalOpenState,
  imageFormatState,
  inLetterWaveState,
  letterIndexState,
  showDemeritImageState,
  showWordImageState,
  useUppercaseState,
  wordListKeyState,
  wordState,
} from './state';

export function Board() {
  const word = useRecoilValue(wordState);
  const letterIndex = useRecoilValue(letterIndexState);
  const showWordImage = useRecoilValue(showWordImageState);
  const showDemeritImage = useRecoilValue(showDemeritImageState);
  const useUppercase = useRecoilValue(useUppercaseState);
  const demeritCount = useRecoilValue(demeritCountState);
  const gameStatus = useRecoilValue(gameStatusState);
  const helpModalOpen = useRecoilValue(helpModalOpenState);
  const inLetterWave = useRecoilValue(inLetterWaveState);

  let mainPanel;
  if (showDemeritImage) {
    mainPanel = (
      <>
        <div className="flex-grow" />
        <DemeritImage index={demeritCount} />
        <div className="flex-grow" />
      </>
    );
  } else if (gameStatus !== 'in-progress') {
    mainPanel = (
      <>
        <div className="flex-grow" />
        <GameStatusPanel />
        <div className="flex-grow" />
      </>
    );
  } else {
    const markedIndex = showWordImage ? undefined : letterIndex;
    mainPanel = (
      <>
        <div className="h-[40%] w-[600px] flex flex-col items-center justify-center">
          {showWordImage ? <WordImage word={word} /> : null}
        </div>
        <div className="flex flex-col space-y-2 > *">
          <div className="h-24 flex flex-col justify-end">
            <Word
              word={word}
              useUppercase={useUppercase}
              markedIndex={markedIndex}
              inLetterWave={inLetterWave}
            />
          </div>
        </div>
        <div className="flex-grow" />
      </>
    );
  }

  const bgClass = STATUS_TO_BG_CLASS[gameStatus];
  return (
    <div
      className={`relative ${bgClass} flex-1 flex flex-col items-center justify-center p-8 space-y-4 > *`}
    >
      {mainPanel}
      <div className="w-4/5 max-h-[40%] flex flex-col justify-end items-center px-3 justify-self-end">
        {helpModalOpen ? <HelpModal /> : <Scoreboard />}
      </div>
    </div>
  );
}

function WordImage({ word }: { word: string }) {
  const wordListKey = useRecoilValue(wordListKeyState);
  const imageFormat = useRecoilValue(imageFormatState);
  return (
    <motion.img
      layoutId={`word-image-${word}`}
      src={`word-images/${wordListKey}/${word}.${imageFormat}`}
      alt={word}
      className="rounded-3xl animate-fade-in min-h-0 object-contain border-black border-2"
    />
  );
}

function DemeritImage({ index }: { index: number }) {
  return (
    <motion.img
      layoutId={`demerit-image-${index}`}
      src="demerit.png"
      alt="demerit"
      className="rounded-3xl animate-fade-in min-h-0 border-black border-2 justify-self-center"
    />
  );
}

function GameStatusPanel() {
  const gameStatus = useRecoilValue(gameStatusState);
  const classes = 'rounded-3xl animate-fade-in min-h-0 border-black border-2 justify-self-center';
  if (gameStatus === 'win') {
    playSound(VICTORY_SONG);
    return <img src="happy-unicorn.gif" alt="unicorn" className={classes} />;
  } else if (gameStatus === 'lose') {
    return <img src="demerit.png" alt="demerit" className={classes} />;
  } else {
    return null;
  }
}

const STATUS_TO_BG_CLASS: Record<GameStatus, string> = {
  win: 'bg-green-500',
  lose: 'bg-red-500',
  'in-progress': 'bg-gray-500',
};
