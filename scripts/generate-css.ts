import { CardColor } from "../dist/cards.js";
import { Archetype } from "../dist/archetypes/base.js";
import { cardCSSColors, archetypeCSSColors } from "../dist/display.js";
import * as fs from "fs";

function toKebabCase(str: string): string {
    return str
        .replace(/(?<!^)([A-Z])/g, "-$1") // CamelBCase to Camel_B_Case
        .toLowerCase();
}

function toSCSSLine(varName: string, colorValue: string): string {
    return `${varName}: ${colorValue};\n`;
}

const scssLines = [];

for (const colorIdStr in cardCSSColors) {
    const colorId = +colorIdStr as CardColor;
    const colorName = CardColor[colorId];
    const scssVarName = `$card-color-${toKebabCase(colorName)}`;
    const colorValue = cardCSSColors[colorId];
    scssLines.push(toSCSSLine(scssVarName, colorValue));
}

scssLines.push("\n");

for (const archetypeIdStr in archetypeCSSColors) {
    const archetypeId = +archetypeIdStr as Archetype;
    const archetypeName = Archetype[archetypeId];
    const scssVarName = `$archetype-color-${toKebabCase(archetypeName)}`;
    const colorValue = archetypeCSSColors[archetypeId];
    scssLines.push(toSCSSLine(scssVarName, colorValue));
}

fs.writeFileSync("./dist/_colors.scss", scssLines.join(""));
