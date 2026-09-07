import { Card } from '../types/card';

export interface QuestionMusicTrack {
  name: string;
  url: string;
  sourceUrl?: string;
  license?: string;
}

const tracks: Record<string, QuestionMusicTrack> = {
  ocean: {
    name: 'Ocean Waves',
    url: '/audio/ocean.ogg',
  },
  forest: {
    name: 'Forest Birds',
    url: '/audio/forest.ogg',
  },
  lava: {
    name: 'Lava Flow',
    url: '/audio/lava.ogg',
  },
  windmill: {
    name: 'Windmill Breeze',
    url: '/audio/windmill.ogg',
  },
  final: {
    name: 'Final Challenge Theme',
    url: '/audio/final.ogg',
  },
};

export function getQuestionMusic(card: Card): QuestionMusicTrack {
  if (
    card.category?.toLowerCase() === 'final-challenge' ||
    card.category?.toLowerCase() === 'final' ||
    card.portalTheme
  ) {
    return tracks.final;
  }

  switch (card.grade) {
    case 7:
      return tracks.ocean;
    case 8:
      return tracks.forest;
    case 9:
      return tracks.lava;
    case 10:
      return tracks.windmill;
    default:
      return tracks.windmill;
  }
}