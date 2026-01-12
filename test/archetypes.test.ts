import { describe, expect, it } from "vitest";
import { CardColor } from "../src/cards";
import { Archetype, generateAllValidSequences } from "../src/archetypes";
import { getCounter } from "../src/archetypes/sequence";
import { getHalf, getPure, getTendency, getWanderer } from "../src/archetypes/specific";

describe("consistency of the rules for each path", () => {
    it("has consistent rules", () => {
        const pathsCounter = new Map<Archetype, number>();

        for (const sequence of generateAllValidSequences()) {
            const counter = getCounter(sequence);
            const pure = getPure(sequence, counter);
            const tendency = getTendency(counter);
            const half = getHalf(counter);

            if (pure !== null) {
                expect(tendency, "matching both a pure and a tendency").toBeNull();
                expect(half, "matching both a pure and a half").toBeNull();
                pathsCounter.set(pure, (pathsCounter.get(pure) || 0) + 1);
            } else if (tendency !== null) {
                expect(half, "matching both a tendency and a half").toBeNull();
                pathsCounter.set(tendency, (pathsCounter.get(tendency) || 0) + 1);
            } else if (half !== null) {
                pathsCounter.set(half, (pathsCounter.get(half) || 0) + 1);
            } else {
                expect(new Set(sequence), "non-all-black sequence matched nothing except wanderer").toEqual(new Set([CardColor.Black]));
                expect(getWanderer(counter), "sequence not matching anything including wanderer").not.toBeNull();
                pathsCounter.set(Archetype.Wanderer, (pathsCounter.get(Archetype.Wanderer) || 0) + 1);
            }
        }

        expect(Array.from(pathsCounter.values()).reduce((a, b) => a+b, 0), "Number of paths")
            .toBe(121);

        expect(pathsCounter.get(Archetype.Wanderer), "Number of Wanderer paths")
            .toBe(1);

        expect(pathsCounter.get(Archetype.Warrior), "Number of Warrior paths (pure archetype)")
            .toBe(14);
        expect(pathsCounter.get(Archetype.Shaman), "Number of Shaman paths (pure archetype)")
            .toBe(14);
        expect(pathsCounter.get(Archetype.Trader), "Number of Trader paths (pure archetype)")
            .toBe(14);

        expect(pathsCounter.get(Archetype.Knight), "Number of Knight paths (tendency archetype)")
            .toBe(12);
        expect(pathsCounter.get(Archetype.Ecologist), "Number of Ecologist paths (tendency archetype)")
            .toBe(12);
        expect(pathsCounter.get(Archetype.Bard), "Number of Bard paths (tendency archetype)")
            .toBe(12);

        expect(pathsCounter.get(Archetype.Diplomat), "Number of Diplomat paths (half archetype)")
            .toBe(14);
        expect(pathsCounter.get(Archetype.Scientist), "Number of Scientist paths (half archetype)")
            .toBe(14);
        expect(pathsCounter.get(Archetype.Zealot), "Number of Zealot paths (half archetype)")
            .toBe(14);
    });
});
