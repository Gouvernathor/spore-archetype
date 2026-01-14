import { Archetype } from "./archetypes/index.js";

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
     * This is a factor, proportional to the perimeter of the pure archetype areas.
     * At 0, they are not visible.
     * At 1/2, half archetypes are not visible.
     * At another value than 1/3, half and tendency areas are not equal and the hexagon is not regular.
     */
    const pureSizeFactor = 1/3;

    /**
     * The convergence point of the Warrior, Knight and Zealot areas.
     * Red Red Green
     */
    const warriorKnightZealot = lerp(r, g, pureSizeFactor);
    /**
     * The convergence point of the Shaman, Ecologist and Zealot areas.
     * Green Green Red
     */
    const shamanEcologistZealot = lerp(g, r, pureSizeFactor);
    /**
     * The convergence point of the Warrior, Knight and Scientist areas.
     * Red Red Blue
     */
    const warriorKnightScientist = lerp(r, b, pureSizeFactor);
    /**
     * The convergence point of the Trader, Bard and Scientist areas.
     * Blue Blue Red
     */
    const traderBardScientist = lerp(b, r, pureSizeFactor);
    /**
     * The convergence point of the Shaman, Ecologist and Diplomat areas.
     * Green Green Blue
     */
    const shamanEcologistDiplomat = lerp(g, b, pureSizeFactor);
    /**
     * The convergence point of the Trader, Bard and Diplomat areas.
     * Blue Blue Green
     */
    const traderBardDiplomat = lerp(b, g, pureSizeFactor);

    /** The center point of the hexagon and of the base triangle */
    const centerPoint: Point = [
        (r[0] + g[0] + b[0]) / 3,
        (r[1] + g[1] + b[1]) / 3,
    ];

    /** The convergence point between the Knight, the Zealot, and the central Wanderer hexagon */
    const knightZealotHex = lerp(centerPoint, warriorKnightZealot, hexfactor);
    /** The convergence point between the Ecologist, the Zealot, and the central Wanderer hexagon */
    const ecologistZealotHex = lerp(centerPoint, shamanEcologistZealot, hexfactor);
    /** The convergence point between the Ecologist, the Diplomat, and the central Wanderer hexagon */
    const ecologistDiplomatHex = lerp(centerPoint, shamanEcologistDiplomat, hexfactor);
    /** The convergence point between the Bard, the Diplomat, and the central Wanderer hexagon */
    const bardDiplomatHex = lerp(centerPoint, traderBardDiplomat, hexfactor);
    /** The convergence point between the Bard, the Scientist, and the central Wanderer hexagon */
    const bardScientistHex = lerp(centerPoint, traderBardScientist, hexfactor);
    /** The convergence point between the Knight, the Scientist, and the central Wanderer hexagon */
    const knightScientistHex = lerp(centerPoint, warriorKnightScientist, hexfactor);

    return [
        {
            id: "base",
            points: [r, g, b],
        }, {
            id: "warrior",
            points: [r, warriorKnightZealot, warriorKnightScientist],
            attributes: propertiesPerArchetype[Archetype.Warrior],
        }, {
            id: "shaman",
            points: [shamanEcologistZealot, g, shamanEcologistDiplomat],
            attributes: propertiesPerArchetype[Archetype.Shaman],
        }, {
            id: "trader",
            points: [traderBardScientist, traderBardDiplomat, b],
            attributes: propertiesPerArchetype[Archetype.Trader],
        }, {
            id: "knight",
            points: [warriorKnightZealot, knightZealotHex, knightScientistHex, warriorKnightScientist],
            attributes: propertiesPerArchetype[Archetype.Knight],
        }, {
            id: "zealot",
            points: [warriorKnightZealot, shamanEcologistZealot, ecologistZealotHex, knightZealotHex],
            attributes: propertiesPerArchetype[Archetype.Zealot],
        }, {
            id: "ecologist",
            points: [shamanEcologistZealot, shamanEcologistDiplomat, ecologistDiplomatHex, ecologistZealotHex],
            attributes: propertiesPerArchetype[Archetype.Ecologist],
        }, {
            id: "diplomat",
            points: [ecologistDiplomatHex, shamanEcologistDiplomat, traderBardDiplomat, bardDiplomatHex],
            attributes: propertiesPerArchetype[Archetype.Diplomat],
        }, {
            id: "bard",
            points: [bardScientistHex, bardDiplomatHex, traderBardDiplomat, traderBardScientist],
            attributes: propertiesPerArchetype[Archetype.Bard],
        }, {
            id: "scientist",
            points: [warriorKnightScientist, knightScientistHex, bardScientistHex, traderBardScientist],
            attributes: propertiesPerArchetype[Archetype.Scientist],
        }, {
            id: "wanderer",
            points: [knightZealotHex, ecologistZealotHex, ecologistDiplomatHex, bardDiplomatHex, bardScientistHex, knightScientistHex],
            attributes: propertiesPerArchetype[Archetype.Wanderer],
        }
    ];
}

function getHauteur(side: number) {
    return Math.sqrt(3) / 2 * side;
}
