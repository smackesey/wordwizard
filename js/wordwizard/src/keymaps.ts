export type Keymap = 'QWERTY' | 'DVORAK';

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
  ['QWERTY', QWERTY_KEYMAP],
  ['DVORAK', DVORAK_KEYMAP],
]);
