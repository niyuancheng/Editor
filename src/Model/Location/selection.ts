import { ExtendedTypes } from "../../custom-types";
import { Range } from "./range";

export type BaseSelection = Range | null;

export type Selection = ExtendedTypes<"Selection",BaseSelection>;