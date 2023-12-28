// ########################
// ##### PHONOGRAMS
// ########################

import { motion } from 'framer-motion';

const VOWELS = ['a', 'e', 'i', 'o', 'u'];

export function Word({
  word,
  useUppercase,
  dimmed,
  markedIndex,
}: {
  word: string;
  useUppercase: boolean;
  dimmed?: boolean;
  markedIndex?: number;
}) {
  return (
    <div className="flex font-mono items-end space-x-2 > *">
      {word.split('').map((letter, i) => {
        const text = useUppercase ? letter.toUpperCase() : letter;
        return <PhonogramTile letter={text} dimmed={dimmed} key={i} marked={i === markedIndex} />;
      })}
    </div>
  );
}

export function Arrow({
  animationKey,
  letterIndex,
}: {
  animationKey: number;
  letterIndex: number;
}) {
  // NOTE: I tried to generate Tailwind classes using arbitrary values here
  // (e.g. `w-[4rem]`), but it did not work-- some of these classes seem to
  // work and others don't.
  const n = (letterIndex + 1) * 4 + letterIndex * 0.5;
  const arrowContainerStyle = { width: `${n}rem` };
  const style = {
    animationDuration: (letterIndex + 1) * 0.5 + 's',
  };
  return (
    <div style={arrowContainerStyle}>
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

function PhonogramTile({
  letter,
  dimmed,
  marked,
}: {
  letter: string;
  dimmed?: boolean;
  marked?: boolean;
}) {
  let bgClass: string;
  if (letter === ' ') {
    bgClass = '';
  } else if (VOWELS.includes(letter.toLowerCase())) {
    bgClass = 'bg-red-500';
  } else {
    bgClass = 'bg-blue-500';
  }
  const opacityClass = dimmed ? 'bg-opacity-20 text-gray-500' : '';
  const sizeClass = marked ? 'w-24 h-24 text-6xl' : 'w-16 h-16 text-5xl';
  const borderClass = marked ? 'border-4 border-yellow-500' : '';
  return (
    <motion.div
      layout
      className={`${bgClass} ${opacityClass} ${sizeClass} ${borderClass} rounded-md flex items-center justify-center`}
    >
      {letter}
    </motion.div>
  );
}
