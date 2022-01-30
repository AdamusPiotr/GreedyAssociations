export type InformationSystem = Record<string, string | number>[];
export type DecisionSystemRow = {
  attributes: Record<string, string | number>;
  decision: Record<string, string | number>;
};
export type DecisionSystem = DecisionSystemRow[];

export type AssosciationRule = DecisionSystemRow & {
  support: number;
  length: number;
};
