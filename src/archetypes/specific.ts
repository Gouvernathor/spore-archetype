import { CardColor, CivilizationCard } from "../cards.js";
import { Archetype } from "./base.js";
import { Sequence } from "./sequence.js";

export function getWanderer(counter: Map<CardColor, number>): Archetype.Wanderer | null {
    // return sequence.every(phase => getCardColor(phase) === CardColor.Black) ? Archetype.Wanderer : null;
    return counter.size === 0 ? Archetype.Wanderer : null;
}

export function getPure(sequence: Sequence, counter: Map<CardColor, number>): Archetype.Warrior | Archetype.Shaman | Archetype.Trader | null {
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

export function getTendency(counter: Map<CardColor, number>): Archetype.Knight | Archetype.Ecologist | Archetype.Bard | null {
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

export function getHalf(counter: Map<CardColor, number>): Archetype.Diplomat | Archetype.Scientist | Archetype.Zealot | null {
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
