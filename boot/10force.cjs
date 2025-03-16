const { JSDOM } = require("jsdom");
const fs = require("fs");
const { generate10force, setDocument } = require("../dist/generate10force.cjs");

setDocument(new JSDOM().window.document);
const svg = generate10force();
fs.writeFileSync("10force.svg", svg.outerHTML);
