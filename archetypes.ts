import { CardColor, CellCard, CivilizationCard, CreatureCard, TribalCard } from "./cards";

export type Sequence = [CellCard, CreatureCard, TribalCard, CivilizationCard];

export enum Archetype {
    Wanderer,

    // meta-archetype : pure
    Warrior,
    Shaman,
    Trader,

    // meta-archetype : tendency
    Knight,
    Ecologist,
    Bard,

    // meta-archetype : half
    Diplomat,
    Scientist,
    Zealot,
}
