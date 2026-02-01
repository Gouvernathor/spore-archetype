import { Archetype } from "./archetypes/index.js";
import { CardColor } from "./cards.js";

export const cardCSSColors: {
    [Card in CardColor]: string;
} = {
    [CardColor.Black]: "black",
    [CardColor.Red]: "color(srgb 0.803 0.247 0.09)",
    [CardColor.Green]: "color(srgb 0.3 0.92 0.37)",
    [CardColor.Blue]: "color(srgb 0.29 0.737 0.851)",
};

export const archetypeCSSColors: {
    [Arch in Archetype]: string;
} = {
    [Archetype.Wanderer]: "color(srgb 0.576 0.584 0.596)",

    [Archetype.Warrior]: "color(srgb 0.803 0.247 0.09)",
    [Archetype.Shaman]: "color(srgb 0.3 0.92 0.37)",
    [Archetype.Trader]: "color(srgb 0.29 0.737 0.851)",

    [Archetype.Knight]: "color(srgb 0.804 0.275 0.6)",
    [Archetype.Ecologist]: "color(srgb 0.635 0.804 0.275)",
    [Archetype.Bard]: "color(srgb 0.282 0.733 0.549)",

    [Archetype.Diplomat]: "color(srgb 0.773 0.792 0.278)",
    [Archetype.Scientist]: "color(srgb 0.314 0.275 0.804)",
    [Archetype.Zealot]: "color(srgb 0.647 0.275 0.804)",
};
