import { CellCard, CivilizationCard, CreatureCard, TribalCard } from "../cards";

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
