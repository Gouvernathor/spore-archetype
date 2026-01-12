import { Archetype } from "./base";
import { Sequence } from "./sequence";

export declare function getArchetype(
    sequence: Sequence,
    nullIfInvalid?: false,
): Archetype;
export declare function getArchetype(
    sequence: Sequence,
    nullIfInvalid: true,
): Archetype|null;
