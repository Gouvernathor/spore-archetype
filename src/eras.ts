export enum Era {
    Cell,
    Creature,
    Tribal,
    Civilization,
    Space,
}

export type EraWithConsequences = Era.Creature | Era.Tribal | Era.Civilization | Era.Space;
export type EraWithCards = Era.Cell | Era.Creature | Era.Tribal | Era.Civilization;
