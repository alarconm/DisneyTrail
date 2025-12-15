// Disney Karaoke Songs for Kristin's Magical Disney Trail

export interface KaraokeSong {
  id: string;
  title: string;
  movie: string;
  artist?: string;
  emoji: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lyrics: LyricLine[];
}

export interface LyricLine {
  text: string;
  time: number; // seconds from start
  beats: number[]; // beat positions (0-100) to hit within this line
}

export const KARAOKE_SONGS: KaraokeSong[] = [
  {
    id: 'let-it-go',
    title: 'Let It Go',
    movie: 'Frozen',
    artist: 'Idina Menzel',
    emoji: '❄️',
    difficulty: 'medium',
    lyrics: [
      { text: "The snow glows white on the mountain tonight", time: 0, beats: [15, 35, 55, 75, 90] },
      { text: "Not a footprint to be seen", time: 4, beats: [20, 45, 70, 90] },
      { text: "A kingdom of isolation", time: 7, beats: [25, 50, 80] },
      { text: "And it looks like I'm the queen", time: 10, beats: [20, 45, 70, 95] },
      { text: "The wind is howling like this swirling storm inside", time: 14, beats: [10, 30, 50, 70, 85] },
      { text: "Couldn't keep it in, heaven knows I've tried", time: 18, beats: [15, 40, 60, 85] },
      { text: "Don't let them in, don't let them see", time: 22, beats: [20, 45, 70, 90] },
      { text: "Be the good girl you always have to be", time: 25, beats: [15, 35, 55, 75, 95] },
      { text: "Conceal, don't feel, don't let them know", time: 29, beats: [20, 45, 75] },
      { text: "Well, now they know!", time: 33, beats: [30, 70] },
      { text: "Let it go! Let it go!", time: 35, beats: [25, 50, 75] },
      { text: "Can't hold it back anymore!", time: 38, beats: [20, 50, 80] },
      { text: "Let it go! Let it go!", time: 41, beats: [25, 50, 75] },
      { text: "Turn away and slam the door!", time: 44, beats: [20, 45, 70, 95] },
    ],
  },
  {
    id: 'how-far-ill-go',
    title: "How Far I'll Go",
    movie: 'Moana',
    artist: "Auli'i Cravalho",
    emoji: '🌊',
    difficulty: 'medium',
    lyrics: [
      { text: "I've been staring at the edge of the water", time: 0, beats: [15, 35, 55, 75, 90] },
      { text: "Long as I can remember", time: 4, beats: [25, 55, 85] },
      { text: "Never really knowing why", time: 7, beats: [30, 60, 90] },
      { text: "I wish I could be the perfect daughter", time: 10, beats: [15, 40, 65, 90] },
      { text: "But I come back to the water", time: 14, beats: [20, 50, 80] },
      { text: "No matter how hard I try", time: 17, beats: [25, 55, 85] },
      { text: "Every turn I take, every trail I track", time: 20, beats: [15, 35, 55, 75, 95] },
      { text: "Every path I make, every road leads back", time: 24, beats: [15, 35, 55, 75, 95] },
      { text: "To the place I know where I cannot go", time: 28, beats: [20, 45, 70, 95] },
      { text: "Where I long to be", time: 32, beats: [30, 70] },
      { text: "See the line where the sky meets the sea", time: 34, beats: [20, 45, 70, 95] },
      { text: "It calls me!", time: 38, beats: [40, 80] },
      { text: "And no one knows how far it goes", time: 40, beats: [20, 50, 80] },
    ],
  },
  {
    id: 'a-whole-new-world',
    title: 'A Whole New World',
    movie: 'Aladdin',
    emoji: '🧞',
    difficulty: 'easy',
    lyrics: [
      { text: "I can show you the world", time: 0, beats: [25, 55, 85] },
      { text: "Shining, shimmering, splendid", time: 4, beats: [20, 50, 80] },
      { text: "Tell me, princess, now when did", time: 8, beats: [20, 45, 70, 95] },
      { text: "You last let your heart decide?", time: 12, beats: [25, 55, 85] },
      { text: "I can open your eyes", time: 16, beats: [30, 60, 90] },
      { text: "Take you wonder by wonder", time: 20, beats: [20, 50, 80] },
      { text: "Over, sideways and under", time: 24, beats: [20, 50, 80] },
      { text: "On a magic carpet ride", time: 28, beats: [25, 55, 85] },
      { text: "A whole new world!", time: 32, beats: [30, 70] },
      { text: "A new fantastic point of view", time: 35, beats: [20, 45, 70, 95] },
      { text: "No one to tell us no", time: 39, beats: [30, 60, 90] },
      { text: "Or where to go", time: 42, beats: [40, 80] },
      { text: "Or say we're only dreaming", time: 44, beats: [25, 55, 85] },
    ],
  },
  {
    id: 'under-the-sea',
    title: 'Under the Sea',
    movie: 'The Little Mermaid',
    emoji: '🦀',
    difficulty: 'hard',
    lyrics: [
      { text: "The seaweed is always greener", time: 0, beats: [15, 35, 60, 85] },
      { text: "In somebody else's lake", time: 3, beats: [20, 50, 80] },
      { text: "You dream about going up there", time: 6, beats: [15, 40, 65, 90] },
      { text: "But that is a big mistake", time: 9, beats: [20, 50, 80] },
      { text: "Just look at the world around you", time: 12, beats: [15, 40, 65, 90] },
      { text: "Right here on the ocean floor", time: 15, beats: [20, 50, 80] },
      { text: "Such wonderful things surround you", time: 18, beats: [15, 40, 65, 90] },
      { text: "What more is you looking for?", time: 21, beats: [20, 45, 70, 95] },
      { text: "Under the sea! Under the sea!", time: 24, beats: [20, 45, 70, 95] },
      { text: "Darling it's better down where it's wetter", time: 27, beats: [10, 30, 50, 70, 90] },
      { text: "Take it from me!", time: 30, beats: [30, 70] },
      { text: "Up on the shore they work all day", time: 32, beats: [20, 45, 70, 95] },
      { text: "Out in the sun they slave away", time: 35, beats: [20, 45, 70, 95] },
    ],
  },
  {
    id: 'hakuna-matata',
    title: 'Hakuna Matata',
    movie: 'The Lion King',
    emoji: '🦁',
    difficulty: 'easy',
    lyrics: [
      { text: "Hakuna Matata!", time: 0, beats: [25, 60, 90] },
      { text: "What a wonderful phrase!", time: 3, beats: [25, 55, 85] },
      { text: "Hakuna Matata!", time: 6, beats: [25, 60, 90] },
      { text: "Ain't no passing craze!", time: 9, beats: [25, 55, 85] },
      { text: "It means no worries", time: 12, beats: [30, 70] },
      { text: "For the rest of your days!", time: 15, beats: [20, 50, 80] },
      { text: "It's our problem-free philosophy!", time: 18, beats: [15, 35, 55, 75, 95] },
      { text: "Hakuna Matata!", time: 22, beats: [25, 60, 90] },
    ],
  },
  {
    id: 'part-of-your-world',
    title: 'Part of Your World',
    movie: 'The Little Mermaid',
    emoji: '🧜‍♀️',
    difficulty: 'medium',
    lyrics: [
      { text: "Look at this stuff, isn't it neat?", time: 0, beats: [20, 45, 70, 95] },
      { text: "Wouldn't you think my collection's complete?", time: 4, beats: [15, 35, 55, 75, 95] },
      { text: "Wouldn't you think I'm the girl", time: 8, beats: [25, 55, 85] },
      { text: "The girl who has everything?", time: 11, beats: [25, 55, 85] },
      { text: "I've got gadgets and gizmos a-plenty", time: 14, beats: [15, 40, 65, 90] },
      { text: "I've got whozits and whatzits galore", time: 18, beats: [15, 40, 65, 90] },
      { text: "You want thingamabobs? I've got twenty!", time: 22, beats: [15, 35, 55, 75, 95] },
      { text: "But who cares? No big deal", time: 26, beats: [25, 55, 85] },
      { text: "I want more!", time: 29, beats: [30, 70] },
      { text: "I wanna be where the people are", time: 31, beats: [20, 50, 80] },
      { text: "I wanna see, wanna see them dancing", time: 35, beats: [15, 35, 60, 85] },
    ],
  },
  {
    id: 'be-our-guest',
    title: 'Be Our Guest',
    movie: 'Beauty and the Beast',
    emoji: '🕯️',
    difficulty: 'hard',
    lyrics: [
      { text: "Be our guest! Be our guest!", time: 0, beats: [25, 50, 75] },
      { text: "Put our service to the test!", time: 3, beats: [15, 40, 65, 90] },
      { text: "Tie your napkin 'round your neck, cherie", time: 6, beats: [10, 30, 50, 70, 90] },
      { text: "And we'll provide the rest!", time: 10, beats: [25, 55, 85] },
      { text: "Soup du jour, hot hors d'oeuvres", time: 13, beats: [20, 50, 80] },
      { text: "Why, we only live to serve!", time: 16, beats: [20, 50, 80] },
      { text: "Try the grey stuff, it's delicious!", time: 19, beats: [15, 40, 65, 90] },
      { text: "Don't believe me? Ask the dishes!", time: 22, beats: [15, 40, 65, 90] },
      { text: "They can sing, they can dance", time: 25, beats: [25, 55, 85] },
      { text: "After all, Miss, this is France!", time: 28, beats: [20, 45, 70, 95] },
      { text: "And a dinner here is never second best!", time: 31, beats: [10, 30, 50, 70, 90] },
      { text: "Go on, unfold your menu", time: 35, beats: [25, 55, 85] },
      { text: "Take a glance and then you'll be our guest!", time: 38, beats: [15, 40, 65, 90] },
    ],
  },
  {
    id: 'colors-of-the-wind',
    title: 'Colors of the Wind',
    movie: 'Pocahontas',
    emoji: '🍃',
    difficulty: 'medium',
    lyrics: [
      { text: "You think you own whatever land you land on", time: 0, beats: [15, 40, 65, 90] },
      { text: "The Earth is just a dead thing you can claim", time: 4, beats: [15, 40, 65, 90] },
      { text: "But I know every rock and tree and creature", time: 8, beats: [15, 35, 55, 75, 95] },
      { text: "Has a life, has a spirit, has a name", time: 12, beats: [20, 45, 70, 95] },
      { text: "You think the only people who are people", time: 16, beats: [15, 40, 65, 90] },
      { text: "Are the people who look and think like you", time: 20, beats: [15, 40, 65, 90] },
      { text: "But if you walk the footsteps of a stranger", time: 24, beats: [15, 35, 55, 75, 95] },
      { text: "You'll learn things you never knew you never knew", time: 28, beats: [10, 30, 50, 70, 90] },
      { text: "Can you paint with all the colors of the wind?", time: 32, beats: [15, 35, 55, 75, 95] },
      { text: "Can you paint with all the colors of the wind?", time: 37, beats: [15, 35, 55, 75, 95] },
    ],
  },
];

export function getRandomSong(): KaraokeSong {
  return KARAOKE_SONGS[Math.floor(Math.random() * KARAOKE_SONGS.length)];
}

export function getSongById(id: string): KaraokeSong | undefined {
  return KARAOKE_SONGS.find(song => song.id === id);
}

export function getSongsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): KaraokeSong[] {
  return KARAOKE_SONGS.filter(song => song.difficulty === difficulty);
}
