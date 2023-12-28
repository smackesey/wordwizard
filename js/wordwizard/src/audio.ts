// ########################
// ##### AUDIO
// ########################

export const ADD_DEMERIT_SOUND = new Audio('demerit.oga');
export const LETTER_FORWARD_SOUND = new Audio('letter-forward.wav');
export const WORD_COMPLETE_SOUND = new Audio('word-complete.mp3');

export function playSound(sound: HTMLAudioElement) {
  if (sound === LETTER_FORWARD_SOUND) {
    sound.currentTime = 0.1;
  } else {
    sound.currentTime = 0;
  }
  sound.play();
}
