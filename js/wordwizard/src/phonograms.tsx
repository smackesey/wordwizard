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
  inLetterWave,
}: {
  word: string;
  useUppercase: boolean;
  dimmed?: boolean;
  markedIndex?: number;
  inLetterWave?: boolean;
}) {
  return (
    <div className="flex font-mono items-end space-x-2 > *">
      {word.split('').map((letter, i) => {
        const text = useUppercase ? letter.toUpperCase() : letter;
        return (
          <PhonogramTile
            letter={text}
            dimmed={dimmed}
            key={i}
            marked={i === markedIndex}
            inLetterWave={inLetterWave}
          />
        );
      })}
    </div>
  );
}

function PhonogramTile({
  letter,
  dimmed,
  marked,
  inLetterWave,
}: {
  letter: string;
  dimmed?: boolean;
  marked?: boolean;
  inLetterWave?: boolean;
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
      transition={{ duration: inLetterWave ? 1.0 : undefined }}
      className={`${bgClass} ${opacityClass} ${sizeClass} ${borderClass} rounded-md flex items-center justify-center`}
    >
      {letter}
    </motion.div>
  );
}
