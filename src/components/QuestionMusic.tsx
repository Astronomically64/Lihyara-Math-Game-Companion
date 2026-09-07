import React, { useEffect, useRef } from 'react';
import { Card } from '../types/card';

const TRACKS = {
  ocean: { name: 'Ocean Waves', url: '/audio/ocean.ogg' },
  forest: { name: 'Forest Birds', url: '/audio/forest.ogg' },
  lava: { name: 'Lava Flow', url: '/audio/lava.ogg' },
  windmill: { name: 'Windmill Breeze', url: '/audio/windmill.ogg' },
  final: { name: 'Final Challenge Theme', url: '/audio/final.ogg' },
};

interface QuestionMusicProps {
  card: Card;
}

export const QuestionMusic: React.FC<QuestionMusicProps> = ({ card }) => {
  const track = React.useMemo(() => {
    const qrId = card.qrId?.toLowerCase() || '';

    // 1. Check for Final Challenge ('f' in qrId or category check)
    if (qrId.includes('f') || card.category?.toLowerCase() === 'final-challenge') {
      return TRACKS.final;
    }

    // 2. Extract grade number: checks regex for g7, g8, g9, g10 patterns first, falls back to card.grade
    const match = qrId.match(/^g(7|8|9|10)[eadfp]\d+$/);
    const gradeNum = match ? parseInt(match[1], 10) : card.grade;

    // 3. Map grade level (including portal challenges) to the corresponding theme sound
    switch (gradeNum) {
      case 7:
        return TRACKS.ocean;
      case 8:
        return TRACKS.forest;
      case 9:
        return TRACKS.lava;
      case 10:
        return TRACKS.windmill;
      default:
        return TRACKS.windmill;
    }
  }, [card]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(track.url);
    audio.loop = true;
    audio.volume = 0.2;
    audioRef.current = audio;

    // Trigger automatic playback on mount
    void audio.play().catch(() => undefined);

    // Stop and clean up resources on unmount
    return () => {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audioRef.current = null;
    };
  }, [track.url]);

  // Headless audio component rendering no UI controls
  return null;
};