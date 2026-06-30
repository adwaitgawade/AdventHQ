"use client";

import {
  RefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type AudioCtx = {
  /** Master switch: when true, inline ambient videos play with sound. */
  soundOn: boolean;
  toggle: () => void;
  setSoundOn: (v: boolean) => void;
};

const Ctx = createContext<AudioCtx>({
  soundOn: false,
  toggle: () => {},
  setSoundOn: () => {},
});

/** Access the site-wide audio master (hero neon toggle + inline videos). */
export const useAudio = () => useContext(Ctx);

/**
 * Imperatively keeps a <video> element's `muted` flag in sync with the global
 * master. React doesn't reliably reflect the `muted` prop to the DOM property,
 * so we set it directly. Pass any extra deps (e.g. a `load` flag) that gate
 * when the element actually mounts, so the sync re-runs once it exists.
 */
export function useMutedSync(
  ref: RefObject<HTMLVideoElement | null>,
  deps: unknown[] = []
) {
  const { soundOn } = useAudio();
  useEffect(() => {
    const v = ref.current;
    if (v) v.muted = !soundOn;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundOn, ...deps]);
  return soundOn;
}

export default function AudioProvider({ children }: { children: ReactNode }) {
  // Default off so muted autoplay is always allowed; the first toggle is a user
  // gesture, which unlocks sound for the rest of the session.
  const [soundOn, setSoundOn] = useState(false);
  const toggle = useCallback(() => setSoundOn((s) => !s), []);

  return (
    <Ctx.Provider value={{ soundOn, toggle, setSoundOn }}>
      {children}
    </Ctx.Provider>
  );
}
