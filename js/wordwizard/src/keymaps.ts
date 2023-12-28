export type Keymap = 'qwerty' | 'dvorak';

export type KeySpec = { character: string; command?: string };
export type KeyboardLayout = KeySpec[][];

export type Action =
  | 'add-demerit'
  | 'letter-mode'
  | 'next-letter'
  | 'next-uncompleted-word'
  | 'next-word'
  | 'previous-letter'
  | 'previous-uncompleted-word'
  | 'previous-word'
  | 'reset'
  | 'toggle-completed'
  | 'word-mode';

const QWERTY_KEYMAP: Map<string, Action> = new Map([
  ['h', 'add-demerit'],
  ['u', 'toggle-completed'],
  ['i', 'letter-mode'],
  ['j', 'previous-letter'],
  [';', 'next-letter'],
  ['l', 'previous-uncompleted-word'],
  ['k', 'next-uncompleted-word'],
  [',', 'previous-word'],
  ['m', 'next-word'],
  ['o', 'word-mode'],
  ['p', 'reset'],
]);

const DVORAK_KEYMAP: Map<string, Action> = new Map([
  ['d', 'add-demerit'],
  ['g', 'toggle-completed'],
  ['c', 'letter-mode'],
  ['h', 'previous-letter'],
  ['s', 'next-letter'],
  ['n', 'previous-uncompleted-word'],
  ['t', 'next-uncompleted-word'],
  ['v', 'previous-word'],
  ['w', 'next-word'],
  ['r', 'word-mode'],
  ['l', 'reset'],
]);

export const KEYMAPS: Map<Keymap, Map<string, Action>> = new Map([
  ['qwerty', QWERTY_KEYMAP],
  ['dvorak', DVORAK_KEYMAP],
]);

export const KEYBOARD_LAYOUTS: Map<Keymap, KeyboardLayout> = new Map([
  [
    'qwerty',
    [
      [
        { character: 'Q' },
        { character: 'W' },
        { character: 'E' },
        { character: 'R' },
        { character: 'T' },
        { character: 'Y' },
        { character: 'U' },
        { character: 'I' },
        { character: 'O' },
        { character: 'P' },
      ],
      [
        { character: 'A' },
        { character: 'S' },
        { character: 'D' },
        { character: 'F' },
        { character: 'G' },
        { character: 'H' },
        { character: 'J' },
        { character: 'K' },
        { character: 'L' },
      ],
      [
        { character: 'Z' },
        { character: 'X' },
        { character: 'C' },
        { character: 'V' },
        { character: 'B' },
        { character: 'N' },
        { character: 'M' },
      ],
    ],
  ],
  [
    'dvorak',
    [
      [
        { character: "'" },
        { character: ',' },
        { character: '.' },
        { character: 'P' },
        { character: 'Y' },
        { character: 'F' },
        { character: 'G' },
        { character: 'C' },
        { character: 'R' },
        { character: 'L' },
      ],
      [
        { character: 'A' },
        { character: 'O' },
        { character: 'E' },
        { character: 'U' },
        { character: 'I' },
        { character: 'D' },
        { character: 'H' },
        { character: 'T' },
        { character: 'N' },
        { character: 'S' },
      ],
      [
        { character: ';' },
        { character: 'Q' },
        { character: 'J' },
        { character: 'K' },
        { character: 'X' },
        { character: 'B' },
        { character: 'M' },
        { character: 'W' },
        { character: 'V' },
        { character: 'Z' },
      ],
    ],
  ],
]);
