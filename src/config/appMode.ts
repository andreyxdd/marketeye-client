export type AppMode = 'standard' | 'micro' | 'bounce';

const SUPPORTED_MODES: AppMode[] = ['standard', 'micro', 'bounce'];

function normalizeMode(raw: string | undefined): AppMode {
  const mode = (raw ?? 'standard').toLowerCase();
  if (!SUPPORTED_MODES.includes(mode as AppMode)) {
    throw new Error(
      `unsupported MARKETEYE_MODE: ${
        raw ?? '(empty)'
      }. Use standard, micro, or bounce.`
    );
  }
  return mode as AppMode;
}

export const APP_MODE = normalizeMode(process.env.MARKETEYE_MODE);
export const isMicro = APP_MODE === 'micro';
