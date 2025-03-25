import { CellCard, CivilizationCard, CreatureCard, TribalCard } from "./cards";

export enum CreatureConsequence {
    RagingRoar = 1,
    SirenSong,
    SummonFlock,
}
export enum TribalConsequence {
    Traps = 1,
    RefreshingStorm,
    FlyingFish,

    FireBombs,
    Fireworks,
    Beastmaster,
}
export enum CivilizationConsequence {
    Invulnerability = 1,
    HealingAura,
    StaticBomb,

    MightyBomb,
    DiploDervish,
    BribeBomb,

    GadgetBomb,
    BlackCloud,
    AdBlitz,
}
export enum SpaceConsequence {
    PowerMonger = 1,
    SocialSuave,
    GentleGeneralist,

    PrimeSpecimen,
    PleasingPerformance,
    SpeedDemon,

    ArmsDealer,
    GraciousGreeting,
    ColonyCraze,

    PirateBGone,
    GreenKeeper,
    SpiceSavant,
}
export type Consequence = CreatureConsequence | TribalConsequence | CivilizationConsequence | SpaceConsequence;

export const cellCardConsequences: ReadonlyMap<CellCard, [CreatureConsequence, TribalConsequence, CivilizationConsequence, SpaceConsequence]> = new Map([
    [CellCard.Carnivore, [CreatureConsequence.RagingRoar, TribalConsequence.Traps, CivilizationConsequence.Invulnerability, SpaceConsequence.PowerMonger]],
    [CellCard.Herbivore, [CreatureConsequence.SirenSong, TribalConsequence.RefreshingStorm, CivilizationConsequence.HealingAura, SpaceConsequence.SocialSuave]],
    [CellCard.Omnivore, [CreatureConsequence.SummonFlock, TribalConsequence.FlyingFish, CivilizationConsequence.StaticBomb, SpaceConsequence.GentleGeneralist]],
]);
export const creatureCardConsequences: ReadonlyMap<CreatureCard, [TribalConsequence, CivilizationConsequence, SpaceConsequence]> = new Map([
    [CreatureCard.Predator, [TribalConsequence.FireBombs, CivilizationConsequence.MightyBomb, SpaceConsequence.PrimeSpecimen]],
    [CreatureCard.Social, [TribalConsequence.Fireworks, CivilizationConsequence.DiploDervish, SpaceConsequence.PleasingPerformance]],
    [CreatureCard.Adaptable, [TribalConsequence.Beastmaster, CivilizationConsequence.BribeBomb, SpaceConsequence.SpeedDemon]],
]);
export const tribalCardConsequences: ReadonlyMap<TribalCard, [CivilizationConsequence, SpaceConsequence]> = new Map([
    [TribalCard.Aggressive, [CivilizationConsequence.GadgetBomb, SpaceConsequence.ArmsDealer]],
    [TribalCard.Friendly, [CivilizationConsequence.BlackCloud, SpaceConsequence.GraciousGreeting]],
    [TribalCard.Industrious, [CivilizationConsequence.AdBlitz, SpaceConsequence.ColonyCraze]],
]);
export const civilizationCardConsequences: ReadonlyMap<CivilizationCard, [SpaceConsequence]> = new Map([
    [CivilizationCard.Military, [SpaceConsequence.PirateBGone]],
    [CivilizationCard.Religious, [SpaceConsequence.GreenKeeper]],
    [CivilizationCard.Economic, [SpaceConsequence.SpiceSavant]],
]);
