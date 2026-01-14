export enum Archetype {
    /**
     * The archetype without any card.
     */
    Wanderer,

    /**
     * A Pure archetype, maximizing the red cards.
     */
    Warrior,
    /**
     * A Pure archetype, maximizing the green cards.
     */
    Shaman,
    /**
     * A Pure archetype, maximizing the blue cards.
     */
    Trader,

    /**
     * A Tendency archetype, tending towards red cards.
     */
    Knight,
    /**
     * A Tendency archetype, tending towards green cards.
     */
    Ecologist,
    /**
     * A Tendency archetype, tending towards blue cards.
     */
    Bard,

    /**
     * A Half archetype, between green and blue cards.
     */
    Diplomat,
    /**
     * A Half archetype, between red and blue cards.
     */
    Scientist,
    /**
     * A Half archetype, between red and green cards.
     */
    Zealot,
}
