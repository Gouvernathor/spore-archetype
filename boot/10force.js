import { JSDOM } from "jsdom";
import * as fs from "fs";
import { generate10force } from "../dist/generate10force.js";
import { archetypeCSSColors } from "../dist/display.js";

globalThis.document = new JSDOM().window.document;
const cssPropsObject = Object.fromEntries(Array.from(Object.keys(archetypeCSSColors), archetype => {
    return [archetype, {fill: archetypeCSSColors[archetype]}];
}));
const svg = generate10force({
    propertiesPerArchetype: cssPropsObject,
});
fs.writeFileSync("out/10force.svg", svg.outerHTML);
