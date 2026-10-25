import { Flashcard } from '../types';

/**
 * Standard SuperMemo SM-2 Spaced Repetition Algorithm
 * Quality score: 0 (blackout) to 5 (perfect recall)
 */
export function calculateSM2(
  card: Flashcard,
  quality: number // 0 to 5
): { reps: number; interval: number; easeFactor: number; dueDate: string } {
  let { reps, interval, easeFactor } = card;

  // Clamp quality between 0 and 5
  const q = Math.max(0, Math.min(5, quality));

  if (q >= 3) {
    if (reps === 0) {
      interval = 1;
    } else if (reps === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    reps += 1;
  } else {
    // Failure resets repetitions and interval to 1 day
    reps = 0;
    interval = 1;
  }

  // Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  // Calculate new due date (current date + interval in days)
  const nextDueDate = new Date();
  nextDueDate.setDate(nextDueDate.getDate() + interval);

  return {
    reps,
    interval,
    easeFactor: Number(easeFactor.toFixed(2)),
    dueDate: nextDueDate.toISOString(),
  };
}

export function isCardDue(card: Flashcard): boolean {
  if (!card.dueDate) return true;
  return new Date(card.dueDate).getTime() <= Date.now();
}
