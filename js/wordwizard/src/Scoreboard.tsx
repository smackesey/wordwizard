// ########################
// ##### SCOREBOARD
// ########################

import { motion } from 'framer-motion';
import React from 'react';
import { useRecoilValue } from 'recoil';
import {
  completedWordRecordsState,
  demeritCountState,
  demeritLimitState,
  numRoundsState,
  roundIndexState,
  totalNumWordsState,
  wordsPerRoundState,
} from './state';
import { FALLBACK_IMAGE, WordListRecord } from './words';

export function Scoreboard() {
  const completedWordRecords = useRecoilValue(completedWordRecordsState);
  const roundIndex = useRecoilValue(roundIndexState);
  const demeritCount = useRecoilValue(demeritCountState);
  const demeritLimit = useRecoilValue(demeritLimitState);
  const wordsPerRound = useRecoilValue(wordsPerRoundState);
  const completedWordsInRound = completedWordRecords.length % wordsPerRound;
  const totalNumWords = useRecoilValue(totalNumWordsState);

  return (
    <motion.div
      layout
      className="
      bg-gray-400 p-3 rounded-lg border-2 border-black w-full
      flex flex-col items-center justify-center space-y-2 > *
      "
    >
      <div className="text-3xl font-bold flex w-full mb-2 space-x-1 > *">
        <Fraction numerator={completedWordRecords.length} denominator={totalNumWords} />
        <div className="text-center flex-grow">Score</div>
        <Fraction numerator={completedWordsInRound} denominator={wordsPerRound} />
      </div>
      <CardCollection
        roundIndex={roundIndex}
        wordsPerRound={wordsPerRound}
        completedWordRecords={completedWordRecords}
      />
      <hr className="h-[2px] flex-shrink-0 border-none bg-black rounded-md w-full" />
      <DemeritMeter demeritLimit={demeritLimit} demeritCount={demeritCount} />
    </motion.div>
  );
}

function Fraction({ numerator, denominator }: { numerator: number; denominator: number }) {
  return (
    <div>
      <sup>{numerator}</sup>/<sub>{denominator}</sub>
    </div>
  );
}

function CardCollection({
  roundIndex,
  wordsPerRound,
  completedWordRecords,
}: {
  roundIndex: number;
  wordsPerRound: number;
  completedWordRecords: WordListRecord[];
}) {
  const totalNumWords = useRecoilValue(totalNumWordsState);
  const numRounds = useRecoilValue(numRoundsState);
  const tileSize = getTileSize(numRounds);

  return (
    <div className="w-full flex flex-col space-y-2 > *">
      {[...Array(roundIndex + 1)].map((_, i) => {
        const previousRowsCount = roundIndex * wordsPerRound;
        const totalRemaining = totalNumWords - previousRowsCount;
        const isLastRound = numRounds === i + 1;
        const wordsInRound = isLastRound ? Math.min(wordsPerRound, totalRemaining) : wordsPerRound;

        return (
          <div
            className="flex w-full items-center justify-center space-x-2 > * animate-fade-in-fast"
            key={i}
          >
            {[...Array(wordsInRound)].map((_, j) => {
              const index = i * wordsPerRound + j;
              const wordRecord = completedWordRecords[index];
              // subtract 4px for the border of the frame
              const img =
                wordRecord === undefined ? null : (
                  <InnerImage wordRecord={wordRecord} tileSize={tileSize} />
                );
              return <ImageTile key={index}>{img}</ImageTile>;
            })}
            ,
          </div>
        );
      })}
    </div>
  );
}

function DemeritMeter({
  demeritLimit,
  demeritCount,
}: {
  demeritLimit: number;
  demeritCount: number;
}) {
  return (
    <div className="max-w-full flex space-x-2 > *">
      {Array.from(Array(demeritLimit)).map((_, i) => (
        <ImageTile key={i}>
          {i < demeritCount ? (
            <motion.img
              src="demerit.png"
              key={i}
              layoutId={`demerit-image-${i}`}
              className="object-cover rounded-lg"
            />
          ) : null}
        </ImageTile>
      ))}
    </div>
  );
}

function InnerImage({ wordRecord, tileSize }: { wordRecord: WordListRecord; tileSize: string }) {
  const [imageSrc, setImageSrc] = React.useState(wordRecord.path);
  const style = { maxWidth: `calc(${tileSize} - 4px)`, maxHeight: `calc(${tileSize} - 4px)` };
  return (
    <motion.img
      src={imageSrc}
      alt={wordRecord.word}
      style={style}
      className="rounded-lg transition-opacity object-contain w-full h-full"
      layoutId={`word-image-${wordRecord.word}`}
      onError={() => setImageSrc(FALLBACK_IMAGE)}
    />
  );
}

function getTileSize(numRounds: number) {
  const num = Math.min(Math.floor(40 / (numRounds + 1)), 8) - 1;
  return `${num}vh`;
}

export function ImageTile({ children }: { children: React.ReactNode }) {
  const numRounds = useRecoilValue(numRoundsState);
  const tileSize = getTileSize(numRounds);
  const style = children ? {} : { width: tileSize };
  const classes = children ? '' : 'square';

  return (
    <motion.div layout style={style} className={`${classes} rounded-lg border-2 border-black`}>
      {children}
    </motion.div>
  );
}
