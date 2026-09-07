import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Volume2, VolumeX } from 'lucide-react';
import { Card } from '../types/card';
import { getQuestionMusic } from '../utils/questionMusic';

const MUSIC_ENABLED_KEY = 'lihyara-question-music-enabled';

interface QuestionMusicProps {
  card: Card;
}

export const QuestionMusic: React.FC<QuestionMusicProps> = ({ card }) => {
  const track = getQuestionMusic(card);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.localStorage.getItem(MUSIC_ENABLED_KEY) !== 'false';
  });

  useEffect(() => {
    const audio = new Audio(track.url);
    audio.loop = true;
    audio.volume = 0.2;
    audioRef.current = audio;

    if (enabled) void audio.play().catch(() => undefined);

    return () => {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audioRef.current = null;
    };
  }, [track.url]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (enabled) void audio.play().catch(() => undefined);
    else audio.pause();

    window.localStorage.setItem(MUSIC_ENABLED_KEY, String(enabled));
  }, [enabled]);

  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => setEnabled((isEnabled) => !isEnabled)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-textOnDark backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
        aria-label={enabled ? `Mute ${track.name}` : `Play ${track.name}`}
        title={`${track.name} - ${track.license}`}
      >
        {enabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </button>
      <a
        href={track.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        aria-label={`Open source for ${track.name}`}
        title={`Source: ${track.name}`}
      >
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
};