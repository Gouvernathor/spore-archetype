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
    return `$${varName}: ${colorValue};\n`;
}

function toCSSLine(varName: string, colorValue: string): string {
    return `    --${varName}: ${colorValue};\n`;
}

const scssLines = [];
const cssLines = [ ":root {\n" ];
for (const colorIdStr in cardCSSColors) {
    const colorId = +colorIdStr as CardColor;
    const varName = `card-color-${toKebabCase(CardColor[colorId])}`;
    const colorValue = cardCSSColors[colorId];
    scssLines.push(toSCSSLine(varName, colorValue));
    cssLines.push(toCSSLine(varName, colorValue));
}
scssLines.push("\n");
for (const archetypeIdStr in archetypeCSSColors) {
    const archetypeId = +archetypeIdStr as Archetype;
    const varName = `archetype-color-${toKebabCase(Archetype[archetypeId])}`;
    const colorValue = archetypeCSSColors[archetypeId];
    scssLines.push(toSCSSLine(varName, colorValue));
    cssLines.push(toCSSLine(varName, colorValue));
}
cssLines.push("}\n");

fs.writeFileSync("./dist/_colors.scss", scssLines.join(""));

fs.writeFileSync("./dist/colors-root.css", cssLines.join(""));
cssLines[0] = ".spore-archetype-colors {\n";
fs.writeFileSync("./dist/colors-classed.css", cssLines.join(""));
