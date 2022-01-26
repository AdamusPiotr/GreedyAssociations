import { Injectable } from '@nestjs/common';
import {
  AssosciationRule,
  DecisionSystem,
  DecisionSystemRow,
} from './models/InformationSystem';
import { cloneDeep, groupBy, isEqual, isUndefined, uniqWith } from 'lodash';

@Injectable()
export class ArrayService {
  constructor() {}

  selectRowsWithAttributeValue(
    decisionSystem: DecisionSystem,
    attribute: string,
    val: string | number,
  ): DecisionSystem {
    return cloneDeep(decisionSystem).filter((row) => {
      return row.attributes[attribute] === val;
    });
  }

  getAmountOfRowsWithDecisionValue(
    decisionSystem: DecisionSystem,
    val: string | number,
  ): number {
    const rowWithDecisionValue = cloneDeep(decisionSystem).filter((row) => {
      return Object.values(row.decision)[0] === val;
    });

    return rowWithDecisionValue.length;
  }

  getOnlyUniqueRows<T extends DecisionSystem | AssosciationRule[]>(
    rules: T,
  ): T {
    return uniqWith(rules, isEqual) as T;
  }

  mergeRowsWithTheSameDecision(decisionSystem: DecisionSystem) {
    const decisionSystemCopy = cloneDeep(decisionSystem);

    const groupedDecisions = groupBy(
      decisionSystem,
      (val1: DecisionSystemRow) => {
        return JSON.stringify(val1.attributes);
      },
    );

    for (const key in groupedDecisions) {
      const element = groupedDecisions[key];

      const localDecisions: Record<string, number> = {};

      element.forEach(({ attributes, decision }) => {
        const decisionValue = Object.values(decision)[0];
        if (isUndefined(localDecisions[decisionValue])) {
          localDecisions[decisionValue] = 1;
        }

        localDecisions[decisionValue] = localDecisions[decisionValue] + 1;
      });

      const [mostCommonDecision] = Object.entries(localDecisions).reduce(
        (acc, next) => {
          return next[1] > acc[1] ? next : acc;
        },
        [, Number.MIN_SAFE_INTEGER],
      );

      if (Object.keys(localDecisions).length > 1) {
        for (const row of decisionSystemCopy) {
          if (isEqual(JSON.parse(key), row.attributes)) {
            const decisionAttributeKey = Object.keys(row.decision)[0];

            row.decision[decisionAttributeKey] = mostCommonDecision;
          }
        }
      }
    }
    return this.getOnlyUniqueRows(decisionSystemCopy);
  }
}
