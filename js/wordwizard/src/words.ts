function shuffle(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index lower than the current element
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at indices i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const WORD_LISTS: Map<string, string[]> = new Map([
  [
    'images',
    shuffle([
      // short a
      'bag',
      'bat',
      'bin',
      'cab',
      'cub',
      'can',
      'cat',
      'fan',
      'ham',
      'hat',
      'jam',
      'lad',
      'man',
      'map',
      'mat',
      'pan',
      'rag',
      'rat',
      'van',

      // short e
      'bed',
      'hen',
      'jet',
      'keg',
      'leg',
      'net',
      'peg',
      'pen',
      'web',

      // short i
      'fin',
      'hit',
      'kid',
      'pig',
      'pin',
      'sit',
      'wig',

      // short u
      'bug',
      'bun',
      'bus',
      'cup',
      'hug',
      'hut',
      'jug',
      'mud',
      'mug',
      'nun',
      'nut',
      'run',
      'sun',
      'tub',
    ]),
  ],
  [
    'phonetic',
    shuffle([
      // short a
      'pat',
      'tap',
      'mad',
      'had',
      'bad',
      'pad',
      'sat',
      'ran',
      'tax',
      'has',
      'gap',
      'wag',
      'gap',
      'gag',
      'lap',
      'rap',
      'yap',
      'gas',
      'lag',
      'dad',
      'an',
      'as',
      'at',

      // short e
      'ten',
      'men',
      'beg',
      'fed',
      'led',
      'wet',
      'let',
      'pet',
      'set',
      'bet',
      'get',
      'yes',
      'hem',
      'yet',
      'met',
      'vex',
      'den',

      // short i
      'lid',
      'nib',
      'pip',
      'bib',
      'ink',
      'vim',
      'win',
      'dig',
      'hid',
      'it ',
      'gig',
      'bit',
      'big',
      'din',
      'jig',
      'nip',
      'sip',
      'lit',
      'rid',
      'tip',
      'rim',
      'if ',
      'in ',
      'rip',
      'is ',
      'did',
      'dim',
      'fit',
      'him',
      'his',
      'kin',
      'wit',
      'dip',

      // short u
      'gun',
      'bud',
      'rug',
      'sum',
      'pup',
      'tug',
      'rut',
      'sup',
      'pun',
      'mutt',
      'fun',
      'dug',
      'gum',
      'but',
      'up',
      'us',
      'rub',
      'hum',
    ]),
  ],
  ['maps', ['map', 'sap', 'maps', 'spam']],
  ['tips', ['tip', 'pit', 'tips', 'spit']],
]);
