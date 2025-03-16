import { JSDOM } from "jsdom";
import { generate10force, setDocument } from "../generate10force";
import fs from "fs";

setDocument(new JSDOM().window.document);
const svg = generate10force();
fs.writeFileSync("10force.svg", svg.outerHTML);
