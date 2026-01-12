import { describe, expect, it } from "vitest";
import { Era } from "../src/eras";
import { CellCard, CivilizationCard, CreatureCard, TribalCard } from "../src/cards";
import { cellCardConsequences, civilizationCardConsequences, creatureCardConsequences, getConsequencesOfCard, tribalCardConsequences } from "../src/consequences";
import { Archetype } from "../src/archetypes";

describe("consistency of runtime checks with typing", () => {
    it("matches cell card consequences", () => {
        for (const card of [CellCard.Carnivore, CellCard.Herbivore, CellCard.Omnivore] as const) {
            const indexConsequences = cellCardConsequences[card];
            const functConsequences = getConsequencesOfCard(card, Era.Cell);
            expect(indexConsequences).toEqual(functConsequences);
        }
    });

    it("matches creature card consequences", () => {
        for (const card of [CreatureCard.Predator, CreatureCard.Social, CreatureCard.Adaptable] as const) {
            const indexConsequences = creatureCardConsequences[card];
            const functConsequences = getConsequencesOfCard(card, Era.Creature);
            expect(indexConsequences).toEqual(functConsequences);
        }
    });

    it("matches tribal card consequences", () => {
        for (const card of [TribalCard.Aggressive, TribalCard.Friendly, TribalCard.Industrious] as const) {
            const indexConsequences = tribalCardConsequences[card];
            const functConsequences = getConsequencesOfCard(card, Era.Tribal);
            expect(indexConsequences).toEqual(functConsequences);
        }
    });

    it("matches civilization card consequences", () => {
        for (const card of [CivilizationCard.Military, CivilizationCard.Religious, CivilizationCard.Economic] as const) {
            const indexConsequences = civilizationCardConsequences[card];
            const functConsequences = getConsequencesOfCard(card, Era.Civilization);
            expect(indexConsequences).toEqual(functConsequences);
        }
    });

    it("has no consequences for archetype cards", () => {
        for (const card of [
            Archetype.Wanderer,
            Archetype.Warrior, Archetype.Shaman, Archetype.Trader,
            Archetype.Knight, Archetype.Ecologist, Archetype.Bard,
            Archetype.Diplomat, Archetype.Scientist, Archetype.Zealot,
        ]) {
            expect(getConsequencesOfCard(card, Era.Space)).toHaveLength(0);
        }
    });
});
