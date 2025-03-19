import { JSDOM } from "jsdom";
import * as fs from "fs";
import { generate10force, setDocument } from "../dist/generate10force.js";

setDocument(new JSDOM().window.document);
const svg = generate10force();
fs.writeFileSync("out/10force.svg", svg.outerHTML);
