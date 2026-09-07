import { Card } from '../types/card';

export interface QuestionMusicTrack {
  name: string;
  url: string;
  sourceUrl: string;
  license: string;
}

const tracks = {
  ocean: {
    name: 'Ocean waves',
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Oceanwavescrushing.ogg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Oceanwavescrushing.ogg',
    license: 'CC BY 3.0 - Luftrum',
  },
  windmill: {
    name: 'Wind through the trees',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Wind_sounds_2020-05-10_1625.mp3',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Wind_sounds_2020-05-10_1625.mp3',
    license: 'CC BY-SA 4.0 - Robert EA Harvey',
  },
  lava: {
    name: 'Forge fire',
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/WWS_Bloweroftheforge.ogg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:WWS_Bloweroftheforge.ogg',
    license: 'CC BY 4.0 - Work With Sounds / La Fonderie',
  },
  forest: {
    name: 'Forest birdsong',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/01/20210321_0900_Birdsong_Bourne_Lincolnshire.mp3',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:20210321_0900_Birdsong_Bourne_Lincolnshire.mp3',
    license: 'CC BY-SA 4.0 - Robert EA Harvey',
  },
  final: {
    name: 'Ride of the Valkyries',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Richard_Wagner_-_Ride_of_the_Valkyries.ogg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Richard_Wagner_-_Ride_of_the_Valkyries.ogg',
    license: 'Public domain - American Symphony Orchestra / Edison Records',
  },
} satisfies Record<string, QuestionMusicTrack>;

export function getQuestionMusic(card: Card): QuestionMusicTrack {
  if (card.category === 'final-challenge') return tracks.final;
  if (card.grade === 7) return tracks.ocean;
  if (card.grade === 8) return tracks.forest;
  if (card.grade === 9) return tracks.lava;
  return tracks.windmill;
}