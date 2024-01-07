// ########################
// ##### SCOREBOARD
// ########################

import { motion } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import {
  completedWordsState,
  demeritCountState,
  demeritLimitState,
  numRoundsState,
  roundIndexState,
  wordsPerRoundState,
} from './state';

export function Scoreboard() {
  const completedWords = useRecoilValue(completedWordsState);
  const roundIndex = useRecoilValue(roundIndexState);
  const demeritCount = useRecoilValue(demeritCountState);
  const demeritLimit = useRecoilValue(demeritLimitState);
  const wordsPerRound = useRecoilValue(wordsPerRoundState);
  const completedWordsInRound = completedWords.length % wordsPerRound;

  return (
    <motion.div
      layout
      className="
      bg-gray-400 p-3 rounded-lg border-2 border-black w-full
      flex flex-col items-center justify-center space-y-2 > *
      "
    >
      <div className="text-3xl font-bold flex w-full mb-2 space-x-1 > *">
        <Fraction
          numerator={completedWords.length}
          denominator={wordsPerRound * (roundIndex + 1)}
        />
        <div className="text-center flex-grow">Score</div>
        <Fraction numerator={completedWordsInRound} denominator={wordsPerRound} />
      </div>
      <CardCollection
        roundIndex={roundIndex}
        wordsPerRound={wordsPerRound}
        completedWords={completedWords}
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
  completedWords,
}: {
  roundIndex: number;
  wordsPerRound: number;
  completedWords: string[];
}) {
  return (
    <div className="w-full flex flex-col space-y-2 > *">
      {[...Array(roundIndex + 1)].map((_, i) => (
        <div className="flex w-full justify-center space-x-2 > * animate-fade-in-fast" key={i}>
          {[...Array(wordsPerRound)].map((_, j) => {
            const index = i * wordsPerRound + j;
            const word = completedWords[index];
            const img =
              word === undefined ? null : (
                <motion.img
                  src={`word-images/${word}.png`}
                  alt={word}
                  className="object-cover rounded-lg transition-opacity"
                  layoutId={`word-image-${word}`}
                />
              );
            return <ImageTile key={index}>{img}</ImageTile>;
          })}
          ,
        </div>
      ))}
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

export function ImageTile({ children }: { children: React.ReactNode }) {
  const numRounds = useRecoilValue(numRoundsState);
  const tileSize = Math.min(Math.floor(40 / (numRounds + 1)), 8) - 1;
  const style = { width: `${tileSize}vh` };
  return (
    <div style={style} className={`square rounded-lg border-2 border-black`}>
      {children}
    </div>
  );
}
