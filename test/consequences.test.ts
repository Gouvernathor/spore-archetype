import { describe, expect, it } from "vitest";
import { Era } from "../src/eras";
import { CellCard, CivilizationCard, CreatureCard, TribalCard } from "../src/cards";
import { cellCardConsequences, civilizationCardConsequences, CivilizationConsequence, creatureCardConsequences, CreatureConsequence, getColorOfConsequence, getConsequencesOfCard, getOriginEraOfConsequence, SpaceConsequence, tribalCardConsequences, TribalConsequence } from "../src/consequences";
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
});

describe("consequence origin era", () => {
    it("returns the correct origin era for each consequence", () => {
        expect(getOriginEraOfConsequence(CreatureConsequence.RagingRoar))
            .toBe(Era.Cell);
        expect(getOriginEraOfConsequence(CreatureConsequence.SirenSong))
            .toBe(Era.Cell);
        expect(getOriginEraOfConsequence(CreatureConsequence.SummonFlock))
            .toBe(Era.Cell);

        expect(getOriginEraOfConsequence(TribalConsequence.Traps))
            .toBe(Era.Cell);
        expect(getOriginEraOfConsequence(TribalConsequence.RefreshingStorm))
            .toBe(Era.Cell);
        expect(getOriginEraOfConsequence(TribalConsequence.FlyingFish))
            .toBe(Era.Cell);
        expect(getOriginEraOfConsequence(TribalConsequence.FireBombs))
            .toBe(Era.Creature);
        expect(getOriginEraOfConsequence(TribalConsequence.Fireworks))
            .toBe(Era.Creature);
        expect(getOriginEraOfConsequence(TribalConsequence.Beastmaster))
            .toBe(Era.Creature);

        expect(getOriginEraOfConsequence(CivilizationConsequence.Invulnerability))
            .toBe(Era.Cell);
        expect(getOriginEraOfConsequence(CivilizationConsequence.HealingAura))
            .toBe(Era.Cell);
        expect(getOriginEraOfConsequence(CivilizationConsequence.StaticBomb))
            .toBe(Era.Cell);
        expect(getOriginEraOfConsequence(CivilizationConsequence.MightyBomb))
            .toBe(Era.Creature);
        expect(getOriginEraOfConsequence(CivilizationConsequence.DiploDervish))
            .toBe(Era.Creature);
        expect(getOriginEraOfConsequence(CivilizationConsequence.BribeBomb))
            .toBe(Era.Creature);
        expect(getOriginEraOfConsequence(CivilizationConsequence.GadgetBomb))
            .toBe(Era.Tribal);
        expect(getOriginEraOfConsequence(CivilizationConsequence.BlackCloud))
            .toBe(Era.Tribal);
        expect(getOriginEraOfConsequence(CivilizationConsequence.AdBlitz))
            .toBe(Era.Tribal);

        expect(getOriginEraOfConsequence(SpaceConsequence.PowerMonger))
            .toBe(Era.Cell);
        expect(getOriginEraOfConsequence(SpaceConsequence.SocialSuave))
            .toBe(Era.Cell);
        expect(getOriginEraOfConsequence(SpaceConsequence.GentleGeneralist))
            .toBe(Era.Cell);
        expect(getOriginEraOfConsequence(SpaceConsequence.PrimeSpecimen))
            .toBe(Era.Creature);
        expect(getOriginEraOfConsequence(SpaceConsequence.PleasingPerformance))
            .toBe(Era.Creature);
        expect(getOriginEraOfConsequence(SpaceConsequence.SpeedDemon))
            .toBe(Era.Creature);
        expect(getOriginEraOfConsequence(SpaceConsequence.ArmsDealer))
            .toBe(Era.Tribal);
        expect(getOriginEraOfConsequence(SpaceConsequence.GraciousGreeting))
            .toBe(Era.Tribal);
        expect(getOriginEraOfConsequence(SpaceConsequence.ColonyCraze))
            .toBe(Era.Tribal);
        expect(getOriginEraOfConsequence(SpaceConsequence.PirateBGone))
            .toBe(Era.Civilization);
        expect(getOriginEraOfConsequence(SpaceConsequence.GreenKeeper))
            .toBe(Era.Civilization);
        expect(getOriginEraOfConsequence(SpaceConsequence.SpiceSavant))
            .toBe(Era.Civilization);
    });
});

describe("consequence origin card", () => {
    it("gives a color consistent with the indexed objects", () => {
        for (const indexedObject of [
            cellCardConsequences,
            creatureCardConsequences,
            tribalCardConsequences,
            civilizationCardConsequences,
        ]) {
            for (const [card, consequences] of Object.entries(indexedObject)) {
                for (const consequence of consequences) {
                    expect(getColorOfConsequence(consequence))
                        .toBe(+card);
                }
            }
        }
    });
});
