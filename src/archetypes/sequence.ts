import { CardColor, CellCard, CivilizationCard, CreatureCard, getCardColor, TribalCard } from "../cards";

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

export function isConsistent(sequence: Sequence) {
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

export function getCounter(sequence: Sequence): Map<CardColor, number> {
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
