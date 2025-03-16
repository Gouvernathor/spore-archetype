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
type Polygon = readonly Point[];

function pointToString(point: Point) {
    return point.join(",");
}
function polygonToString(polygon: Polygon) {
    return polygon.map(pointToString).join(" ");
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

    for (const [id, points] of Object.entries(polygons)) {
        const polygon = g.appendChild(doc.createElementNS(SVG_NS, "polygon"));
        polygon.setAttribute("id", id);
        polygon.setAttribute("points", polygonToString(points));
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
}: Config): {[id: string]: Polygon} {
    const hauteur = Math.sqrt(3) / 2 * width;
    const marge = (height - hauteur) / 2;

    const r: Point = [width / 2, marge];
    const g: Point = [0, width-marge];
    const b: Point = [width, width-marge];

    const warriorZealot: Point = [width / 3, (width+marge) / 3];
    const zealotShaman: Point = [width / 6, 2*width/3 - marge/3];
    const warriorScientist: Point = [2*width/3, (width+marge) / 3];
    const scientistTrader: Point = [5*width/6, 2*width/3 - marge/3];
    const shamanDiplomat: Point = [width / 3, width];
    const diplomatTrader: Point = [2*width/3, width];

    const doctoredFactor = (1 - hexfactor) / 2;
    const kzh = lerp(warriorZealot, diplomatTrader, doctoredFactor);
    const zeh = lerp(zealotShaman, scientistTrader, doctoredFactor);
    const edh = lerp(shamanDiplomat, warriorScientist, doctoredFactor);
    const dbh = lerp(diplomatTrader, warriorZealot, doctoredFactor);
    const sbh = lerp(scientistTrader, zealotShaman, doctoredFactor);
    const ksh = lerp(warriorScientist, shamanDiplomat, doctoredFactor);

    return {
        base: [r, g, b],

        warrior: [r, warriorZealot, warriorScientist],
        shaman: [zealotShaman, g, shamanDiplomat],
        trader: [scientistTrader, diplomatTrader, b],

        knight: [warriorZealot, kzh, ksh, warriorScientist],
        zealot: [warriorZealot, zealotShaman, zeh, kzh],
        ecologist: [zealotShaman, shamanDiplomat, edh, zeh],
        diplomat: [edh, shamanDiplomat, diplomatTrader, dbh],
        bard: [sbh, dbh, diplomatTrader, scientistTrader],
        scientist: [warriorScientist, ksh, sbh, scientistTrader],
    };
}
