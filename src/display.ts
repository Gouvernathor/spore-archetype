import { Archetype } from "./archetypes";
import { CardColor } from "./cards.js";

export const cardCSSColors = new Map([
    [CardColor.Black, "#000000"],
    [CardColor.Red, "#CE3F17"],
    [CardColor.Green, "#4DEC5F"],
    [CardColor.Blue, "#4ABDDA"],
]);

export const archetypeCSSColors = new Map([
    [Archetype.Wanderer, "#939699"],

    [Archetype.Warrior, "#CE3F17"],
    [Archetype.Shaman, "#4DEC5F"],
    [Archetype.Trader, "#4ABDDA"],

    [Archetype.Knight, "#CE469A"],
    [Archetype.Ecologist, "#A3CE46"],
    [Archetype.Bard, "#48BC8D"],

    [Archetype.Diplomat, "#C6CB47"],
    [Archetype.Scientist, "#5046CE"],
    [Archetype.Zealot, "#A646CE"],
]);
