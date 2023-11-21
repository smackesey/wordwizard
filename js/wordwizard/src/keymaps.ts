export type Keymap = 'QWERTY' | 'DVORAK';

export type Action =
  | 'toggle-completed'
  | 'letter-mode'
  | 'previous-letter'
  | 'next-letter'
  | 'previous-uncompleted-word'
  | 'next-uncompleted-word'
  | 'previous-word'
  | 'next-word'
  | 'word-mode'
  | 'reset';

const QWERTY_KEYMAP: Map<string, Action> = new Map([
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
