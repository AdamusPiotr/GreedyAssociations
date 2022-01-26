import { Injectable } from '@nestjs/common';
import {
  AssosciationRule,
  DecisionSystem,
  DecisionSystemRow,
  InformationSystem,
} from './models/InformationSystem';
import { omit, uniq, cloneDeep, isEqual } from 'lodash';
import { ArrayService } from './array.service';
import { HeuristicService } from './heuristic.service';

@Injectable()
export class InformationSystemService {
  constructor(
    private arrayService: ArrayService,
    private heuristicService: HeuristicService,
  ) {}

  convertToDecisionSystems(informationSystem: InformationSystem) {
    const decisionSystems: DecisionSystem[] = [];
    const attributes = Object.keys(informationSystem[0]);

    attributes.forEach((attr) => {
      const decisionSystem: DecisionSystem = [];

      informationSystem.forEach((row) => {
        const decision = { [attr]: row[attr] };
        const conditionalAttrs = omit(row, [attr]);

        decisionSystem.push({ decision, attributes: conditionalAttrs });
      });

      const decisionSystemWithMergedRows =
        this.arrayService.mergeRowsWithTheSameDecision(decisionSystem);

      decisionSystems.push(decisionSystemWithMergedRows);
    });

    return decisionSystems;
  }

  isDegenerated(decisionSystem: DecisionSystem) {
    if (decisionSystem.length === 0) {
      return true;
    }

    const decisions = decisionSystem.map(
      (row) => Object.values(row.decision)[0],
    );

    return uniq(decisions).length === 1;
  }

  generateAssociationRuleForRow(
    decisionSystem: DecisionSystem,
    rowIndex: number,
  ): AssosciationRule {
    let subTable = cloneDeep(decisionSystem); //deep copy
    const d = Object.values(decisionSystem[rowIndex].decision)[0];
    const attributes = Object.keys(decisionSystem[0].attributes);
    const rL = {};
    const rP = { ...decisionSystem[rowIndex].decision };

    const originalRow = cloneDeep(decisionSystem[rowIndex]);
    let currentSubTableIndex = rowIndex;

    if (this.isDegenerated(subTable)) {
      return undefined;
    }

    while (!this.isDegenerated(subTable)) {
      const localHeuristicResults: Record<string, number> = attributes.reduce(
        (acc, nextAttr) => {
          const attrValueInRow =
            subTable[currentSubTableIndex].attributes[nextAttr];
          const localSubTable = this.arrayService.selectRowsWithAttributeValue(
            subTable,
            nextAttr,
            attrValueInRow,
          );

          return {
            ...acc,
            [nextAttr]: this.heuristicService.m(localSubTable, d),
          };
        },
        {},
      );

      const nextDescriptorLocalValue = Object.values(
        localHeuristicResults,
      ).reduce((acc, value) => {
        return acc < value ? acc : value;
      }, Number.MAX_SAFE_INTEGER);

      const [nextDescriptorAttr] = Object.entries(localHeuristicResults).find(
        ([key, value]) => value === nextDescriptorLocalValue,
      );

      const nextDescriptorValue =
        subTable[currentSubTableIndex].attributes[nextDescriptorAttr];

      rL[nextDescriptorAttr] = nextDescriptorValue;

      subTable = this.arrayService.selectRowsWithAttributeValue(
        subTable,
        nextDescriptorAttr,
        nextDescriptorValue,
      );

      currentSubTableIndex = subTable.findIndex((row) =>
        isEqual(row, originalRow),
      );
    }

    return {
      attributes: rL,
      decision: rP,
      support: subTable.length,
      length: Object.keys(rL).length,
    };
  }

  generateAllAssociationRulesForSystem(decisionSystem: DecisionSystem) {
    const rules: AssosciationRule[] = [];

    decisionSystem.forEach((_, index) => {
      console.log('row index', index);
      const rule = this.generateAssociationRuleForRow(decisionSystem, index);
      rules.push(rule);
    });

    return rules;
  }

  generateAssociationRulesForInformationSystem(
    informationSystem: InformationSystem,
  ) {
    const setOfAllRules: AssosciationRule[] = [];

    const decisionSystems = this.convertToDecisionSystems(informationSystem);
    decisionSystems.forEach((d) =>
      console.log(
        'decisionSystems',
        d.length,
        Object.keys(d[0].attributes).length,
      ),
    );

    decisionSystems.forEach((decisionSystem, i) => {
      console.log(i);
      const rules = this.generateAllAssociationRulesForSystem(decisionSystem);

      const onlyRulesProperlyGenerated: AssosciationRule[] =
        rules.filter(Boolean);

      setOfAllRules.push(...onlyRulesProperlyGenerated);
    });

    const uniqueRows = this.arrayService.getOnlyUniqueRows(setOfAllRules);

    return {
      rules: uniqueRows,
      summary: {
        avgLength:
          uniqueRows.reduce((acc, prev) => acc + prev.length, 0) /
          uniqueRows.length,
        avgSupport:
          uniqueRows.reduce((acc, prev) => acc + prev.support, 0) /
          uniqueRows.length,
      },
    };
  }
}
