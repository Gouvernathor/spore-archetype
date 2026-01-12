import { Archetype } from "./base.js";
import { getCounter, isConsistent, Sequence } from "./sequence.js";
import { getHalf, getPure, getTendency, getWanderer } from "./specific.js";

export { Archetype } from "./base.js";
export { generateAllValidSequences, Sequence } from "./sequence.js";

/**
 * if you have three of the same color, or all of the same color, you are pure of that color
 * elif you have one of each exactly, you are pure of the last (civ) one
 * elif you have one card for each color but one more of one color (1-1-2), you are a tendency of that color
 * elif you have cards of exactly two colors with no 3 cards of the same color, you are half of those two colors
 * @param nullIfInvalid if the sequence is inconsistent and this is true, return null instead of throwing an error
 */
export function getArchetype(
    sequence: Sequence,
    nullIfInvalid?: false,
): Archetype;
export function getArchetype(
    sequence: Sequence,
    nullIfInvalid: true,
): Archetype|null;
export function getArchetype(
    sequence: Sequence,
    nullIfInvalid = false,
): Archetype | null {
    if (!isConsistent(sequence)) {
        if (nullIfInvalid) {
            return null;
        }
        throw new Error("Invalid sequence");
    }

    const counter = getCounter(sequence);
    return getWanderer(counter) || getPure(sequence, counter) || getTendency(counter) || getHalf(counter);
}
export default getArchetype;
