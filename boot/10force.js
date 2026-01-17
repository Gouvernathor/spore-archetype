import { JSDOM } from "jsdom";
import * as fs from "fs";
import { generate10force } from "../dist/generate10force.js";

globalThis.document = new JSDOM().window.document;
const svg = generate10force();
fs.writeFileSync("out/10force.svg", svg.outerHTML);
