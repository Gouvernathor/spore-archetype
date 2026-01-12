import { describe, expect, it } from "vitest";
import { Era } from "../src/eras";
import { CellCard, CivilizationCard, CreatureCard, TribalCard } from "../src/cards";
import { cellCardConsequences, civilizationCardConsequences, creatureCardConsequences, getConsequencesOfCard, tribalCardConsequences } from "../src/consequences";
import { Archetype } from "../src/archetypes";

describe("consistency of runtime checks with typing", () => {
    it("matches cell card consequences", () => {
        for (const card of [CellCard.Carnivore, CellCard.Herbivore, CellCard.Omnivore]) {
            const mapConsequences = cellCardConsequences.get(card);
            const funConsequences = getConsequencesOfCard(card, Era.Cell);
            expect(mapConsequences).toEqual(funConsequences);
        }
    });

    it("matches creature card consequences", () => {
        for (const card of [CreatureCard.Predator, CreatureCard.Social, CreatureCard.Adaptable]) {
            const mapConsequences = creatureCardConsequences.get(card);
            const funConsequences = getConsequencesOfCard(card, Era.Creature);
            expect(mapConsequences).toEqual(funConsequences);
        }
    });

    it("matches tribal card consequences", () => {
        for (const card of [TribalCard.Aggressive, TribalCard.Friendly, TribalCard.Industrious]) {
            const mapConsequences = tribalCardConsequences.get(card);
            const funConsequences = getConsequencesOfCard(card, Era.Tribal);
            expect(mapConsequences).toEqual(funConsequences);
        }
    });

    it("matches civilization card consequences", () => {
        for (const card of [CivilizationCard.Military, CivilizationCard.Religious, CivilizationCard.Economic]) {
            const mapConsequences = civilizationCardConsequences.get(card);
            const funConsequences = getConsequencesOfCard(card, Era.Civilization);
            expect(mapConsequences).toEqual(funConsequences);
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
