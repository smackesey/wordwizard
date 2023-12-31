// ########################
// ##### AUDIO
// ########################

export const ADD_DEMERIT_SOUND = new Audio('demerit.oga');
export const MOVE_LETTER_SOUND = new Audio('letter-forward.wav');
export const WORD_COMPLETE_SOUND = new Audio('word-complete.mp3');
export const VICTORY_SONG = new Audio('somewhere-over-the-rainbow.oga');

export function playSound(sound: HTMLAudioElement) {
  if (sound === MOVE_LETTER_SOUND) {
    sound.currentTime = 0.1;
  } else {
    sound.currentTime = 0;
  }
  sound.play();
}
