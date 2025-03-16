import { CardColor, CellCard, CivilizationCard, CreatureCard, getCardColor, TribalCard } from "./cards";

export type Sequence = [CellCard, CreatureCard, TribalCard, CivilizationCard];

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

export function getArchetype(sequence: Sequence, nullIfInvalid?: false): Archetype;
export function getArchetype(sequence: Sequence, nullIfInvalid: true): Archetype | null;
export default function getArchetype(sequence: Sequence, nullIfInvalid: boolean = false): Archetype | null {
    if (!isConsistent(sequence)) {
        if (nullIfInvalid) {
            return null;
        }
        throw new Error("Invalid sequence");
    }

    // if you have three of the same color, or all of the same color, you are pure of that color
    // elif you have one of each exactly, you are pure of the last (civ) one
    // elif you have one card for each color but one more of one color (1-1-2), you are a tendency of that color
    // elif you have cards of exactly two colors with no 3 cards of the same color, you are half of those two colors
    throw new Error("TODO")
}

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

function getPure(sequence: Sequence): Archetype.Warrior | Archetype.Shaman | Archetype.Trader | null {
    const counter = getCounter(sequence);

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

function getTendency(sequence: Sequence): Archetype.Knight | Archetype.Ecologist | Archetype.Bard | null {
    const counter = getCounter(sequence);

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

function getHalf(sequence: Sequence): Archetype.Diplomat | Archetype.Scientist | Archetype.Zealot | null {
    const counter = getCounter(sequence);

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
