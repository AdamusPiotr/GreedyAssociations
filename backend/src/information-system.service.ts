import { Injectable } from '@nestjs/common';
import {
  AssosciationRule,
  DecisionSystem,
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
    let subTable = decisionSystem; //deep copy
    const [d] = Object.values(decisionSystem[rowIndex].decision);
    let attributes = Object.keys(decisionSystem[0].attributes);

    const rL = {};
    const rP = { ...decisionSystem[rowIndex].decision };

    const originalRow = decisionSystem[rowIndex];

    const isDegenerated = this.isDegenerated(subTable);

    if (isDegenerated) {
      return undefined;
    }

    while (!this.isDegenerated(subTable)) {
      const localHeuristicResults = attributes.map((attr) => {
        const attrValueInRow = originalRow.attributes[attr];

        const localSubTable = this.arrayService.selectRowsWithAttributeValue(
          subTable,
          attr,
          attrValueInRow,
        );

        return {
          localSubTable,
          value: this.heuristicService.m(localSubTable, d),
          attr,
          attrValue: attrValueInRow,
        };
      });

      localHeuristicResults.sort((a, b) => {
        return a.value - b.value;
      });

      const [nextVal] = localHeuristicResults;

      rL[nextVal.attr] = nextVal.attrValue;

      subTable = nextVal.localSubTable;

      attributes = attributes.filter((x) => x !== nextVal.attr);
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
      const rule = this.generateAssociationRuleForRow(decisionSystem, index);

      rules.push(rule);
    });

    return rules;
  }

  generateAssociationRulesForInformationSystem(
    informationSystem: InformationSystem,
  ) {
    const setOfAllRules: any[] = [];

    const decisionSystems = this.convertToDecisionSystems(informationSystem);

    decisionSystems.forEach((decisionSystem, i) => {
      const rules = this.generateAllAssociationRulesForSystem(decisionSystem);

      const onlyRulesProperlyGenerated: AssosciationRule[] =
        rules.filter(Boolean);

      setOfAllRules.push(...onlyRulesProperlyGenerated);
    });

    const uniqueRows = this.arrayService.getOnlyUniqueRows(setOfAllRules);

    const { length, support, sumSupport, sumLength } = uniqueRows.reduce(
      (acc, r) => ({
        length: [...acc.length, r.length],
        support: [...acc.support, r.support],
        sumSupport: acc.sumSupport + r.support,
        sumLength: acc.sumLength + r.length,
      }),
      {
        sumSupport: 0,
        sumLength: 0,
        length: [],
        support: [],
      },
    );

    return {
      rules: uniqueRows,
      summary: {
        avgLength: sumLength / uniqueRows.length,
        avgSupport: sumSupport / uniqueRows.length,
        minLength: Math.min(...length),
        maxLength: Math.max(...length),
        maxSupport: Math.max(...support),
        minSupport: Math.min(...support),
      },
    };
  }
}
