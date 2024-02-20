// ########################
// ##### BOARD
// ########################

import { motion } from 'framer-motion';
import React from 'react';

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
  inLetterWaveState,
  letterIndexState,
  letterModeState,
  selectedWordImageState,
  showDemeritImageState,
  showFullBoardImageState,
  showWordImageState,
  useUppercaseState,
  wordRecordState,
} from './state';
import { FALLBACK_IMAGE, WordListRecord } from './words';

export function Board() {
  const wordRecord = useRecoilValue(wordRecordState);
  const letterIndex = useRecoilValue(letterIndexState);
  const showWordImage = useRecoilValue(showWordImageState);
  const showFullBoardImage = useRecoilValue(showFullBoardImageState);
  const useUppercase = useRecoilValue(useUppercaseState);
  const gameStatus = useRecoilValue(gameStatusState);
  const helpModalOpen = useRecoilValue(helpModalOpenState);
  const inLetterWave = useRecoilValue(inLetterWaveState);
  const letterMode = useRecoilValue(letterModeState);

  let mainPanel;
  if (showFullBoardImage) {
    mainPanel = (
      <>
        <div className="flex-grow" />
        <FullBoardImage />
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
    const markedIndex = (letterMode || inLetterWave) && !showWordImage ? letterIndex : undefined;
    mainPanel = (
      <>
        <div className="h-[40%] w-[600px] flex flex-col items-center justify-center">
          {showWordImage ? <WordImage wordRecord={wordRecord} /> : null}
        </div>
        <div className="flex flex-col space-y-2 > *">
          <div className="h-24 flex flex-col justify-end">
            <Word
              word={wordRecord.word}
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

function WordImage({ wordRecord }: { wordRecord: WordListRecord }) {
  const [imageSrc, setImageSrc] = React.useState(wordRecord.path);
  return (
    <motion.img
      layoutId={`word-image-${wordRecord.word}`}
      src={imageSrc}
      alt={wordRecord.word}
      className="rounded-3xl animate-fade-in min-h-0 object-contain border-black border-2"
      onError={() => setImageSrc(FALLBACK_IMAGE)}
    />
  );
}

function FullBoardImage() {
  const showDemeritImage = useRecoilValue(showDemeritImageState);
  const demeritCount = useRecoilValue(demeritCountState);
  const selectedWordImage = useRecoilValue(selectedWordImageState);
  let img;
  const classes =
    'rounded-3xl animate-fade-in-fast min-h-0 border-black border-2 justify-self-center';
  if (showDemeritImage) {
    img = (
      <motion.img
        layoutId={`demerit-image-${demeritCount}`}
        src="demerit.png"
        alt="demerit"
        className={classes}
      />
    );
  } else if (selectedWordImage) {
    img = <img src={selectedWordImage} alt={selectedWordImage} className={classes} />;
  }
  return (
    <>
      <div className="flex-grow" />
      {img}
      <div className="flex-grow" />
    </>
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
