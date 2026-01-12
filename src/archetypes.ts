import { CardColor, CellCard, CivilizationCard, CreatureCard, getCardColor, TribalCard } from "./cards.js";

export type Sequence = [CellCard, CreatureCard, TribalCard, CivilizationCard];

export function* generateAllValidSequences() {
    for (const cell of [CellCard.Skipped, CellCard.Carnivore, CellCard.Herbivore, CellCard.Omnivore]) {
        for (const creature of [CreatureCard.Skipped, CreatureCard.Predator, CreatureCard.Social, CreatureCard.Adaptable]) {
            if (creature === CreatureCard.Skipped && cell !== CellCard.Skipped) {
                continue;
            }

            for (const tribal of [TribalCard.Skipped, TribalCard.Aggressive, TribalCard.Friendly, TribalCard.Industrious]) {
                if (tribal === TribalCard.Skipped && creature !== CreatureCard.Skipped) {
                    continue;
                }

                for (const civilization of [CivilizationCard.Skipped, CivilizationCard.Military, CivilizationCard.Religious, CivilizationCard.Economic]) {
                    if (civilization === CivilizationCard.Skipped && tribal !== TribalCard.Skipped) {
                        continue;
                    }

                    yield [cell, creature, tribal, civilization] as Sequence;
                }
            }
        }
    }
}

export enum Archetype {
    Wanderer,

    // meta-archetype : pure
    Warrior,
    Shaman,
    Trader,

    // meta-archetype : tendency
    Knight,
    Ecologist,
    Bard,

    // meta-archetype : half
    Diplomat,
    Scientist,
    Zealot,
}

/**
 * if you have three of the same color, or all of the same color, you are pure of that color
 * elif you have one of each exactly, you are pure of the last (civ) one
 * elif you have one card for each color but one more of one color (1-1-2), you are a tendency of that color
 * elif you have cards of exactly two colors with no 3 cards of the same color, you are half of those two colors
 * @param nullIfInvalid if the sequence is inconsistent and this is true, return null instead of throwing an error
 */
export function getArchetype(sequence: Sequence, nullIfInvalid?: false): Archetype;
export function getArchetype(sequence: Sequence, nullIfInvalid: true): Archetype | null;
export function getArchetype(sequence: Sequence, nullIfInvalid: boolean = false): Archetype | null {
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

function isConsistent(sequence: Sequence) {
    // consistency check
    let isSkipped = true;
    for (const phase of sequence) {
        if (getCardColor(phase) !== CardColor.Black) {
            isSkipped = false;
        } else if (!isSkipped) {
            return false;
        }
    }
    return true;
}

function getCounter(sequence: Sequence): Map<CardColor, number> {
    // number of phases with each color (except black)
    const counter: Map<CardColor, number> = new Map();
    for (const phase of sequence) {
        const color = getCardColor(phase);
        if (color !== CardColor.Black) {
            counter.set(color, (counter.get(color) || 0) + 1);
        }
    }
    counter.delete(CardColor.Black);
    return counter;
}

function getWanderer(counter: Map<CardColor, number>): Archetype.Wanderer | null {
    // return sequence.every(phase => getCardColor(phase) === CardColor.Black) ? Archetype.Wanderer : null;
    return counter.size === 0 ? Archetype.Wanderer : null;
}

function getPure(sequence: Sequence, counter: Map<CardColor, number>): Archetype.Warrior | Archetype.Shaman | Archetype.Trader | null {
    // all non-skipped of the same color
    if (counter.size === 1) {
        const color = counter.keys().next().value as CardColor;
        switch (color) {
            case CardColor.Red:
                return Archetype.Warrior;
            case CardColor.Green:
                return Archetype.Shaman;
            case CardColor.Blue:
                return Archetype.Trader;
        }
    }

    // (at least) three of the same color
    for (const [color, count] of counter) {
        if (count >= 3) {
            switch (color) {
                case CardColor.Red:
                    return Archetype.Warrior;
                case CardColor.Green:
                    return Archetype.Shaman;
                case CardColor.Blue:
                    return Archetype.Trader;
            }
        }
    }

    // one of each exactly
    if (counter.get(CardColor.Red) === 1 && counter.get(CardColor.Green) === 1 && counter.get(CardColor.Blue) === 1) {
        // return the last color, which is the color of the last phase
        switch (sequence[3]) {
            case CivilizationCard.Military:
                return Archetype.Warrior;
            case CivilizationCard.Religious:
                return Archetype.Shaman;
            case CivilizationCard.Economic:
                return Archetype.Trader;
        }
    }

    return null; // not pure
}

function getTendency(counter: Map<CardColor, number>): Archetype.Knight | Archetype.Ecologist | Archetype.Bard | null {
    // one card for each color but one more of one color (1-1-2)
    // which means, 3 different colors, and one with a value of 2
    if (counter.size === 3) {
        for (const [color, count] of counter) {
            if (count === 2) {
                switch (color) {
                    case CardColor.Red:
                        return Archetype.Knight;
                    case CardColor.Green:
                        return Archetype.Ecologist;
                    case CardColor.Blue:
                        return Archetype.Bard;
                    default:
                        // no other color can have 2 if the counter has all 3, skip other loops
                        return null;
                }
            }
        }
    }
    return null;
}

function getHalf(counter: Map<CardColor, number>): Archetype.Diplomat | Archetype.Scientist | Archetype.Zealot | null {
    // cards of exactly two colors with no 3 cards of the same color
    if (counter.size === 2 && !Array.from(counter.values()).some(count => count >= 3)) {
        if (!counter.has(CardColor.Red)) {
            return Archetype.Diplomat;
        } else if (!counter.has(CardColor.Green)) {
            return Archetype.Scientist;
        } else if (!counter.has(CardColor.Blue)) {
            return Archetype.Zealot;
        }
        throw new Error("Invalid sequence");
    }
    return null;
}

/**
 * Test for the consistency of the rules for each path.
 * test that for each sequence, either:
 * - the sequence has a black after a non-black, and is invalid
 * - the sequence is all-black, wanderer, and returns null for all three checkers
 * - the sequence returns a value for exactly one of the checkers
*/
export function testAll() {
    const pathsCounter: Map<Archetype, number> = new Map();

    for (const sequence of generateAllValidSequences()) {
        const counter = getCounter(sequence);
        const pure = getPure(sequence, counter);
        const tendency = getTendency(counter);
        const half = getHalf(counter);

        if (pure !== null) {
            if (tendency !== null) {
                throw new Error(`Sequence ${sequence} got non-null for pure and tendency`);
            } else if (half !== null) {
                throw new Error(`Sequence ${sequence} got non-null for pure and half`);
            } else {
                pathsCounter.set(pure, (pathsCounter.get(pure) || 0) + 1);
            }
        } else if (tendency !== null) {
            if (half !== null) {
                throw new Error(`Sequence ${sequence} got non-null for tendency and half`);
            } else {
                pathsCounter.set(tendency, (pathsCounter.get(tendency) || 0) + 1);
            }
        } else if (half !== null) {
            pathsCounter.set(half, (pathsCounter.get(half) || 0) + 1);
        } else {
            // all three checkers returned null
            // test that the sequence is all-black
            if (!sequence.every(phase => getCardColor(phase) === CardColor.Black)) {
                throw new Error(`Sequence ${sequence} got null for all checkers`);
            } else {
                pathsCounter.set(Archetype.Wanderer, (pathsCounter.get(Archetype.Wanderer) || 0) + 1);
            }
        }
    }

    console.log(`Number of paths, expecting 121 : ${Array.from(pathsCounter.values()).reduce((a, b) => a + b, 0)}`);
    console.log(`Number of Wanderer paths, expecting 1 : ${pathsCounter.get(Archetype.Wanderer)}`);
    console.log("Number of pure paths, expecting 14 each :");
    console.log(`Warrior : ${pathsCounter.get(Archetype.Warrior)}`);
    console.log(`Shaman : ${pathsCounter.get(Archetype.Shaman)}`);
    console.log(`Trader : ${pathsCounter.get(Archetype.Trader)}`);
    console.log("Number of tendency paths, expecting 12 each :");
    console.log(`Knight : ${pathsCounter.get(Archetype.Knight)}`);
    console.log(`Ecologist : ${pathsCounter.get(Archetype.Ecologist)}`);
    console.log(`Bard : ${pathsCounter.get(Archetype.Bard)}`);
    console.log("Number of half paths, expecting 14 each :");
    console.log(`Diplomat : ${pathsCounter.get(Archetype.Diplomat)}`);
    console.log(`Scientist : ${pathsCounter.get(Archetype.Scientist)}`);
    console.log(`Zealot : ${pathsCounter.get(Archetype.Zealot)}`);
    return pathsCounter;
}
