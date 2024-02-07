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
  tileSizeState,
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
              return (
                <ImageTile key={index}>
                  {wordRecord === undefined ? null : (
                    <InnerImage
                      src={wordRecord.path}
                      alt={wordRecord.word}
                      layoutId={`word-image-${wordRecord.word}`}
                    />
                  )}
                </ImageTile>
              );
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
            <InnerImage src="demerit.png" alt="demerit" key={i} layoutId={`demerit-image-${i}`} />
          ) : null}
        </ImageTile>
      ))}
    </div>
  );
}

function InnerImage({ src, alt, layoutId }: { src: string; alt: string; layoutId: string }) {
  const [imageSrc, setImageSrc] = React.useState(src);
  const tileSize = useRecoilValue(tileSizeState);
  const style = { maxWidth: `calc(${tileSize} - 4px)`, maxHeight: `calc(${tileSize} - 4px)` };
  return (
    <motion.img
      src={imageSrc}
      alt={alt}
      style={style}
      className="rounded-lg transition-opacity object-contain w-full h-full"
      layoutId={layoutId}
      onError={() => setImageSrc(FALLBACK_IMAGE)}
    />
  );
}

export function ImageTile({ children }: { children: React.ReactNode }) {
  const tileSize = useRecoilValue(tileSizeState);
  const style = children ? {} : { width: tileSize, height: tileSize };
  return (
    <motion.div layout style={style} className="rounded-lg border-2 border-black">
      {children}
    </motion.div>
  );
}
