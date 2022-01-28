import { Injectable } from '@nestjs/common';
import { ArrayService } from './array.service';
import { DecisionSystem } from './models/InformationSystem';

@Injectable()
export class HeuristicService {
  optimum = {
    m: 'min',
    rm: 'min',
    poly: 'max',
    log: 'max',
    maxCov: 'min',
  };

  constructor(private arrayService: ArrayService) {}

  private calculateAlphaAndBeta(
    subTable: DecisionSystem,
    decisionTable: DecisionSystem,
    decision: number | string,
  ) {
    const originalTableLength = decisionTable.length;
    const originalTableWithDecisionLength =
      this.arrayService.getAmountOfRowsWithDecisionValue(
        decisionTable,
        decision,
      );
    const subTableLength = subTable.length;
    const subTableWithDecisionLength =
      this.arrayService.getAmountOfRowsWithDecisionValue(
        decisionTable,
        decision,
      );

    const alpha = originalTableWithDecisionLength - subTableWithDecisionLength;
    const beta =
      originalTableLength -
      originalTableWithDecisionLength -
      (subTableLength - subTableWithDecisionLength);

    return { alpha, beta };
  }

  m(subTable: DecisionSystem, decision: string | number) {
    return (
      subTable.length -
      this.arrayService.getAmountOfRowsWithDecisionValue(subTable, decision)
    );
  }

  rm(subTable: DecisionSystem, decision: string | number) {
    return (
      (subTable.length -
        this.arrayService.getAmountOfRowsWithDecisionValue(
          subTable,
          decision,
        )) /
      subTable.length
    );
  }

  maxCov(
    subTable: DecisionSystem,
    decision: string | number,
    decisionTable: DecisionSystem,
  ) {
    const { alpha, beta } = this.calculateAlphaAndBeta(
      subTable,
      decisionTable,
      decision,
    );

    if (beta > 0) {
      return false;
    }

    return alpha;
  }

  log(
    subTable: DecisionSystem,
    decision: string | number,
    decisionTable: DecisionSystem,
  ) {
    const { alpha, beta } = this.calculateAlphaAndBeta(
      subTable,
      decisionTable,
      decision,
    );

    return beta / Math.log2(alpha + 2);
  }

  poly(
    subTable: DecisionSystem,
    decision: string | number,
    decisionTable: DecisionSystem,
  ) {
    const { alpha, beta } = this.calculateAlphaAndBeta(
      subTable,
      decisionTable,
      decision,
    );

    return beta / (alpha + 1);
  }
}
