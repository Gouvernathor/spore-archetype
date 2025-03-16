import { Archetype } from "./archetypes";
import { archetypeCSSColors } from "./display";

let doc = globalThis.document;
export function setDocument(document: Document) {
    doc = document;
}

type Config = {
    width: number,
    height: number,
    topmargin: boolean,
    bottommargin: boolean,
    hexfactor: number,
}
type Point = readonly [number, number];
type Points = readonly Point[];
type Polygon = {
    id: string,
    points: Points,
    color?: string,
};

function pointToString(point: Point) {
    return point.join(",");
}
function pointsToString(points: Points) {
    return points.map(pointToString).join(" ");
}

function lerp(a: Point, b: Point, t: number): Point {
    return [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])];
}

const SVG_NS = "http://www.w3.org/2000/svg";

export function generate10force(partial: Partial<Config> = {}): SVGSVGElement {
    const config = getConfig(partial);

    const polygons = generatePolygons(config);

    const svg = doc.createElementNS(SVG_NS, "svg");
    svg.setAttribute("xmlns", SVG_NS);
    svg.setAttribute("width", config.width.toString());
    svg.setAttribute("height", config.height.toString());

    const g = svg.appendChild(doc.createElementNS(SVG_NS, "g"));
    g.setAttribute("stroke", "black");
    g.setAttribute("stroke-width", "1");
    g.setAttribute("fill", "none");

    for (const polygon of polygons) {
        const svgPolygon = g.appendChild(doc.createElementNS(SVG_NS, "polygon"));
        svgPolygon.setAttribute("id", polygon.id);
        svgPolygon.setAttribute("points", pointsToString(polygon.points));
        if (polygon.color) {
            svgPolygon.setAttribute("fill", polygon.color);
        }
    }

    return svg;
}

function getConfig({
    width = 800,
    height = width,
    topmargin = true,
    bottommargin = topmargin,
    hexfactor = 1/3,
}: Partial<Config>): Config {
    return {width, height, topmargin, bottommargin, hexfactor};
}

function generatePolygons({
    width,
    height,
    // topmargin = true,
    // bottommargin = topmargin,
    hexfactor,
}: Config): Polygon[] {
    const hauteur = Math.sqrt(3) / 2 * width;
    const marge = (height - hauteur) / 2;

    const r: Point = [width / 2, marge];
    const g: Point = [0, height-marge];
    const b: Point = [width, height-marge];

    const warriorZealot: Point = [width / 3, (height+marge) / 3];
    const zealotShaman: Point = [width / 6, 2*height/3 - marge/3];
    const warriorScientist: Point = [2*width/3, (height+marge) / 3];
    const scientistTrader: Point = [5*width/6, 2*height/3 - marge/3];
    const shamanDiplomat: Point = [width / 3, height-marge];
    const diplomatTrader: Point = [2*width/3, height-marge];

    const doctoredFactor = (1 - hexfactor) / 2;
    const kzh = lerp(warriorZealot, diplomatTrader, doctoredFactor);
    const zeh = lerp(zealotShaman, scientistTrader, doctoredFactor);
    const edh = lerp(shamanDiplomat, warriorScientist, doctoredFactor);
    const dbh = lerp(diplomatTrader, warriorZealot, doctoredFactor);
    const sbh = lerp(scientistTrader, zealotShaman, doctoredFactor);
    const ksh = lerp(warriorScientist, shamanDiplomat, doctoredFactor);

    return [
        {
            id: "base",
            points: [r, g, b],
        }, {
            id: "warrior",
            points: [r, warriorZealot, warriorScientist],
            color: archetypeCSSColors.get(Archetype.Warrior)!,
        }, {
            id: "shaman",
            points: [zealotShaman, g, shamanDiplomat],
            color: archetypeCSSColors.get(Archetype.Shaman)!,
        }, {
            id: "trader",
            points: [scientistTrader, diplomatTrader, b],
            color: archetypeCSSColors.get(Archetype.Trader)!,
        }, {
            id: "knight",
            points: [warriorZealot, kzh, ksh, warriorScientist],
            color: archetypeCSSColors.get(Archetype.Knight)!,
        }, {
            id: "zealot",
            points: [warriorZealot, zealotShaman, zeh, kzh],
            color: archetypeCSSColors.get(Archetype.Zealot)!,
        }, {
            id: "ecologist",
            points: [zealotShaman, shamanDiplomat, edh, zeh],
            color: archetypeCSSColors.get(Archetype.Ecologist)!,
        }, {
            id: "diplomat",
            points: [edh, shamanDiplomat, diplomatTrader, dbh],
            color: archetypeCSSColors.get(Archetype.Diplomat)!,
        }, {
            id: "bard",
            points: [sbh, dbh, diplomatTrader, scientistTrader],
            color: archetypeCSSColors.get(Archetype.Bard)!,
        }, {
            id: "scientist",
            points: [warriorScientist, ksh, sbh, scientistTrader],
            color: archetypeCSSColors.get(Archetype.Scientist)!,
        }, {
            id: "wanderer",
            points: [kzh, zeh, edh, dbh, sbh, ksh],
            color: archetypeCSSColors.get(Archetype.Wanderer)!,
        }
    ];
}
