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
    return decisionSystem.filter((row) => {
      return row.attributes[attribute] === val;
    });
  }

  getAmountOfRowsWithDecisionValue(
    decisionSystem: DecisionSystem,
    val: string | number,
  ): number {
    const rowWithDecisionValue = decisionSystem.filter((row) => {
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

    const mostCommonDecisions = {};

    for (const key in groupedDecisions) {
      const element = groupedDecisions[key];

      const localDecisions: Record<string, number> = {};

      element.forEach(({ decision }) => {
        const [decisionValue] = Object.values(decision);

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

      mostCommonDecisions[key] = mostCommonDecision;
    }

    const mergedDecisions = decisionSystemCopy.map((r) => {
      const key = JSON.stringify(r.attributes);
      const [decisionKey] = Object.keys(r.decision);

      return {
        attributes: r.attributes,
        decision: { [decisionKey]: mostCommonDecisions[key] },
      };
    });

    return this.getOnlyUniqueRows(mergedDecisions);
  }
}
