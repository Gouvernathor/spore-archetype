import { JSDOM } from "jsdom";
import * as fs from "fs";
import { generate10force, setDocument } from "../dist/generate10force.js";
import { archetypeCSSColors } from "../dist/display.js";

setDocument(new JSDOM().window.document);
const cssPropsObject = Object.fromEntries(Array.from(archetypeCSSColors, ([archetype, color]) => {
    return [archetype, {fill: color}];
}));
const svg = generate10force({
    propertiesPerArchetype: cssPropsObject,
});
fs.writeFileSync("out/10force.svg", svg.outerHTML);
