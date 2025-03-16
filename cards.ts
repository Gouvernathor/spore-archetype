export enum CardColor {
    Black,
    Red,
    Green,
    Blue,
}

export enum CellCard {
    Skipped = CardColor.Black,
    Carnivore = CardColor.Red,
    Herbivore = CardColor.Green,
    Omnivore = CardColor.Blue,
}
export enum CreatureCard {
    Skipped = CardColor.Black,
    Predator = CardColor.Red,
    Social = CardColor.Green,
    Adaptable = CardColor.Blue,
}
export enum TribalCard {
    Skipped = CardColor.Black,
    Aggressive = CardColor.Red,
    Friendly = CardColor.Green,
    Industrious = CardColor.Blue,
}
export enum CivilizationCard {
    Skipped = CardColor.Black,
    Military = CardColor.Red,
    Religious = CardColor.Green,
    Economic = CardColor.Blue,
}

export function getCardColor(color: CellCard|CreatureCard|TribalCard|CivilizationCard) {
    return color as number as CardColor;
}
