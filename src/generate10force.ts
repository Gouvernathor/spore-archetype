import { Archetype } from "./archetypes/index.js";
import { archetypeCSSColors } from "./display.js";

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
     * This is the ratio of the size of a side of the triangle of a pure archetype
     * over the side of the overall triangle.
     * Between 0 (pure archetypes not visible) and 1/2.
     * At another value than 1/3, half and tendency areas are not equal and the hexagon is not regular.
     * At another value than √(1/10), some areas will always be a different area than the pure triangles.
     */
    readonly pureTriangleFactor: number,

    /**
     * This is a factor, proportional to the perimeter of the center hexagon.
     * At 0, there is no center hexagon.
     * At 1, all 6 non-pure archetypes have no room to be displayed.
     */
    readonly hexFactor: number,

    readonly propertiesPerArchetype: { readonly [key in Archetype]?: { [key: string]: string } },
};
/**
 * Preset such that the hexagon is regular,
 * and the shapes of tendency and half archetype areas are all the same.
 */
export const REGULAR_CONFIG: Partial<Config> = {
    pureTriangleFactor: 1/3,
};
/**
 * Preset where all archetype areas are equal. (wip)
 */
export const ALL_EQUAL_CONFIG: Partial<Config> = {
    pureTriangleFactor: Math.sqrt(1/10),
    // hexfactor: ???,
};

type Point = readonly [number, number];
type Points = readonly Point[];
interface Polygon {
    readonly class?: string,
    readonly points: Points,
    /**
     * Either a color,
     * or a pair made of a CSS variable name and a default color,
     * or the same without a default color.
     */
    readonly fill?: string|[string]|[string, string];
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
        if (polygon.class) {
            svgPolygon.classList = polygon.class;
        }
        svgPolygon.setAttribute("points", pointsToString(polygon.points));
        let fill = polygon.fill;
        if (fill) {
            if (typeof fill !== "string") {
                // the elements, no square brackets, separated by a comma if needed
                fill = `var(${fill})`;
            }
            svgPolygon.setAttribute("fill", fill);
        }
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
    pureTriangleFactor = 1/3,
    hexFactor = 1/3,
    propertiesPerArchetype = {},
}: Partial<Config>): Config {
    return {side, pureTriangleFactor, hexFactor, propertiesPerArchetype};
}

function generatePolygons({
    side,
    pureTriangleFactor,
    hexFactor,
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
    const warriorKnightZealot = lerp(r, g, pureTriangleFactor);
    /**
     * The convergence point of the Shaman, Ecologist and Zealot areas.
     * Green Green Red
     */
    const shamanEcologistZealot = lerp(g, r, pureTriangleFactor);
    /**
     * The convergence point of the Warrior, Knight and Scientist areas.
     * Red Red Blue
     */
    const warriorKnightScientist = lerp(r, b, pureTriangleFactor);
    /**
     * The convergence point of the Trader, Bard and Scientist areas.
     * Blue Blue Red
     */
    const traderBardScientist = lerp(b, r, pureTriangleFactor);
    /**
     * The convergence point of the Shaman, Ecologist and Diplomat areas.
     * Green Green Blue
     */
    const shamanEcologistDiplomat = lerp(g, b, pureTriangleFactor);
    /**
     * The convergence point of the Trader, Bard and Diplomat areas.
     * Blue Blue Green
     */
    const traderBardDiplomat = lerp(b, g, pureTriangleFactor);

    /** The center point of the hexagon and of the base triangle */
    const centerPoint: Point = [
        (r[0] + g[0] + b[0]) / 3,
        (r[1] + g[1] + b[1]) / 3,
    ];

    /** The convergence point between the Knight, the Zealot, and the central Wanderer hexagon */
    const knightZealotHex = lerp(centerPoint, warriorKnightZealot, hexFactor);
    /** The convergence point between the Ecologist, the Zealot, and the central Wanderer hexagon */
    const ecologistZealotHex = lerp(centerPoint, shamanEcologistZealot, hexFactor);
    /** The convergence point between the Ecologist, the Diplomat, and the central Wanderer hexagon */
    const ecologistDiplomatHex = lerp(centerPoint, shamanEcologistDiplomat, hexFactor);
    /** The convergence point between the Bard, the Diplomat, and the central Wanderer hexagon */
    const bardDiplomatHex = lerp(centerPoint, traderBardDiplomat, hexFactor);
    /** The convergence point between the Bard, the Scientist, and the central Wanderer hexagon */
    const bardScientistHex = lerp(centerPoint, traderBardScientist, hexFactor);
    /** The convergence point between the Knight, the Scientist, and the central Wanderer hexagon */
    const knightScientistHex = lerp(centerPoint, warriorKnightScientist, hexFactor);

    return [{
    //     class: "base",
    //     points: [r, g, b],
    // }, {
        class: "warrior",
        points: [r, warriorKnightZealot, warriorKnightScientist],
        fill: ["--archetype-color-warrior", archetypeCSSColors[Archetype.Warrior]],
        attributes: propertiesPerArchetype[Archetype.Warrior],
    }, {
        class: "shaman",
        points: [shamanEcologistZealot, g, shamanEcologistDiplomat],
        fill: ["--archetype-color-shaman", archetypeCSSColors[Archetype.Shaman]],
        attributes: propertiesPerArchetype[Archetype.Shaman],
    }, {
        class: "trader",
        points: [traderBardScientist, traderBardDiplomat, b],
        fill: ["--archetype-color-trader", archetypeCSSColors[Archetype.Trader]],
        attributes: propertiesPerArchetype[Archetype.Trader],
    }, {
        class: "knight",
        points: [warriorKnightZealot, knightZealotHex, knightScientistHex, warriorKnightScientist],
        fill: ["--archetype-color-knight", archetypeCSSColors[Archetype.Knight]],
        attributes: propertiesPerArchetype[Archetype.Knight],
    }, {
        class: "zealot",
        points: [warriorKnightZealot, shamanEcologistZealot, ecologistZealotHex, knightZealotHex],
        fill: ["--archetype-color-zealot", archetypeCSSColors[Archetype.Zealot]],
        attributes: propertiesPerArchetype[Archetype.Zealot],
    }, {
        class: "ecologist",
        points: [shamanEcologistZealot, shamanEcologistDiplomat, ecologistDiplomatHex, ecologistZealotHex],
        fill: ["--archetype-color-ecologist", archetypeCSSColors[Archetype.Ecologist]],
        attributes: propertiesPerArchetype[Archetype.Ecologist],
    }, {
        class: "diplomat",
        points: [ecologistDiplomatHex, shamanEcologistDiplomat, traderBardDiplomat, bardDiplomatHex],
        fill: ["--archetype-color-diplomat", archetypeCSSColors[Archetype.Diplomat]],
        attributes: propertiesPerArchetype[Archetype.Diplomat],
    }, {
        class: "bard",
        points: [bardScientistHex, bardDiplomatHex, traderBardDiplomat, traderBardScientist],
        fill: ["--archetype-color-bard", archetypeCSSColors[Archetype.Bard]],
        attributes: propertiesPerArchetype[Archetype.Bard],
    }, {
        class: "scientist",
        points: [warriorKnightScientist, knightScientistHex, bardScientistHex, traderBardScientist],
        fill: ["--archetype-color-scientist", archetypeCSSColors[Archetype.Scientist]],
        attributes: propertiesPerArchetype[Archetype.Scientist],
    }, {
        class: "wanderer",
        points: [knightZealotHex, ecologistZealotHex, ecologistDiplomatHex, bardDiplomatHex, bardScientistHex, knightScientistHex],
        fill: ["--archetype-color-wanderer", archetypeCSSColors[Archetype.Wanderer]],
        attributes: propertiesPerArchetype[Archetype.Wanderer],
    }];
}

function getHauteur(side: number) {
    return Math.sqrt(3) / 2 * side;
}
