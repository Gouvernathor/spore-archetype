import { Archetype } from "./archetypes";

/**
 * Makes the document constant available, whether in a browser or in Node.js,
 * without ever importing it in browser mode.
 */
if (!globalThis.document) {
    await import("jsdom")
        .then(m => globalThis.document = new m.JSDOM().window.document)
        .catch(() =>
            console.error("Failed to load jsdom or the document constant at load time : you need to set globalThis.document before generating SVGs in Node.js"));
}

interface Config {
    /** The size of a side of the big triangle. */
    readonly side: number,

    /**
     * This is a factor, proportional to the perimeter of the center hexagon.
     * At 0, there is no center hexagon.
     * At 1, all 6 non-pure archetypes have no room to be displayed.
     */
    readonly hexfactor: number,

    readonly propertiesPerArchetype: { readonly [key in Archetype]?: { [key: string]: string } },
};
type Point = readonly [number, number];
type Points = readonly Point[];
interface Polygon {
    readonly id: string,
    readonly points: Points,
    readonly attributes?: {[attribute: string]: string}|undefined,
};

function pointToString(point: Point) {
    return point.join(",");
}
function pointsToString(points: Points) {
    return points.map(pointToString).join(" ");
}

/**
 * @param t when 0: returns a, when 1: returns b.
 */
function lerp(a: Point, b: Point, t: number): Point {
    return [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])];
}

const SVG_NS = "http://www.w3.org/2000/svg";

export function generate10force(partial: Partial<Config> = {}): SVGSVGElement {
    const config = getConfig(partial);

    const polygons = generatePolygons(config);

    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("xmlns", SVG_NS);
    svg.setAttribute("width", config.side.toString());
    svg.setAttribute("height", getHauteur(config.side).toString());

    const g = svg.appendChild(document.createElementNS(SVG_NS, "g"));
    g.setAttribute("stroke", "black");
    g.setAttribute("stroke-width", "1");
    g.setAttribute("fill", "none");

    for (const polygon of polygons) {
        const svgPolygon = g.appendChild(document.createElementNS(SVG_NS, "polygon"));
        svgPolygon.setAttribute("id", polygon.id);
        svgPolygon.setAttribute("points", pointsToString(polygon.points));
        if (polygon.attributes) {
            for (const [attribute, value] of Object.entries(polygon.attributes)) {
                svgPolygon.setAttribute(attribute, value);
            }
        }
    }

    return svg;
}

function getConfig({
    side = 800,
    hexfactor = 1/3,
    propertiesPerArchetype = {},
}: Partial<Config>): Config {
    return {side, hexfactor, propertiesPerArchetype};
}

function generatePolygons({
    side,
    hexfactor,
    propertiesPerArchetype,
}: Config): Polygon[] {
    const hauteur = getHauteur(side);

    /** The point of the base triangle where there are the most red cards */
    const r: Point = [side / 2, 0];
    /** The point of the base triangle where there are the most green cards */
    const g: Point = [0, hauteur];
    /** The point of the base triangle where there are the most blue cards */
    const b: Point = [side, hauteur];

    /**
     * The convergence point of the Warrior, Knight and Zealot areas.
     * Red Red Green
     */
    const warriorZealot = lerp(r, g, 1/3);
    /**
     * The convergence point of the Shaman, Ecologist and Zealot areas.
     * Green Green Red
     */
    const zealotShaman = lerp(r, g, 2/3);
    /**
     * The convergence point of the Warrior, Knight and Scientist areas.
     * Red Red Blue
     */
    const warriorScientist = lerp(r, b, 1/3);
    /**
     * The convergence point of the Trader, Bard and Scientist areas.
     * Blue Blue Red
     */
    const scientistTrader = lerp(r, b, 2/3);
    /**
     * The convergence point of the Shaman, Ecologist and Diplomat areas.
     * Green Green Blue
     */
    const shamanDiplomat = lerp(g, b, 1/3);
    /**
     * The convergence point of the Trader, Bard and Diplomat areas.
     * Blue Blue Green
     */
    const diplomatTrader = lerp(g, b, 2/3);

    /** The center point of the hexagon and of the base triangle */
    const centerPoint: Point = [
        (r[0] + g[0] + b[0]) / 3,
        (r[1] + g[1] + b[1]) / 3,
    ];

    /** The convergence point between the Knight, the Zealot, and the central Wanderer hexagon */
    const kzh = lerp(centerPoint, warriorZealot, hexfactor);
    /** The convergence point between the Ecologist, the Zealot, and the central Wanderer hexagon */
    const zeh = lerp(centerPoint, zealotShaman, hexfactor);
    /** The convergence point between the Ecologist, the Diplomat, and the central Wanderer hexagon */
    const edh = lerp(centerPoint, shamanDiplomat, hexfactor);
    /** The convergence point between the Bard, the Diplomat, and the central Wanderer hexagon */
    const dbh = lerp(centerPoint, diplomatTrader, hexfactor);
    /** The convergence point between the Bard, the Scientist, and the central Wanderer hexagon */
    const sbh = lerp(centerPoint, scientistTrader, hexfactor);
    /** The convergence point between the Knight, the Scientist, and the central Wanderer hexagon */
    const ksh = lerp(centerPoint, warriorScientist, hexfactor);

    return [
        {
            id: "base",
            points: [r, g, b],
        }, {
            id: "warrior",
            points: [r, warriorZealot, warriorScientist],
            attributes: propertiesPerArchetype[Archetype.Warrior],
        }, {
            id: "shaman",
            points: [zealotShaman, g, shamanDiplomat],
            attributes: propertiesPerArchetype[Archetype.Shaman],
        }, {
            id: "trader",
            points: [scientistTrader, diplomatTrader, b],
            attributes: propertiesPerArchetype[Archetype.Trader],
        }, {
            id: "knight",
            points: [warriorZealot, kzh, ksh, warriorScientist],
            attributes: propertiesPerArchetype[Archetype.Knight],
        }, {
            id: "zealot",
            points: [warriorZealot, zealotShaman, zeh, kzh],
            attributes: propertiesPerArchetype[Archetype.Zealot],
        }, {
            id: "ecologist",
            points: [zealotShaman, shamanDiplomat, edh, zeh],
            attributes: propertiesPerArchetype[Archetype.Ecologist],
        }, {
            id: "diplomat",
            points: [edh, shamanDiplomat, diplomatTrader, dbh],
            attributes: propertiesPerArchetype[Archetype.Diplomat],
        }, {
            id: "bard",
            points: [sbh, dbh, diplomatTrader, scientistTrader],
            attributes: propertiesPerArchetype[Archetype.Bard],
        }, {
            id: "scientist",
            points: [warriorScientist, ksh, sbh, scientistTrader],
            attributes: propertiesPerArchetype[Archetype.Scientist],
        }, {
            id: "wanderer",
            points: [kzh, zeh, edh, dbh, sbh, ksh],
            attributes: propertiesPerArchetype[Archetype.Wanderer],
        }
    ];
}

function getHauteur(side: number) {
    return Math.sqrt(3) / 2 * side;
}
