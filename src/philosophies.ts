import { Archetype } from "./archetypes.js";

export enum Philosophy {
    Chance,
    Order,
    Life,
    Force,
    Science,
    Harmony,
    Prosperity,
    Faith,
}

export const philosophyByArchetype = new Map([
    [Archetype.Bard, Philosophy.Chance],
    [Archetype.Diplomat, Philosophy.Order],
    [Archetype.Ecologist, Philosophy.Life],
    [Archetype.Knight, Philosophy.Force],
    [Archetype.Scientist, Philosophy.Science],
    [Archetype.Shaman, Philosophy.Harmony],
    [Archetype.Trader, Philosophy.Prosperity],
    [Archetype.Wanderer, Philosophy.Order],
    [Archetype.Warrior, Philosophy.Force],
    [Archetype.Zealot, Philosophy.Faith],
]);
