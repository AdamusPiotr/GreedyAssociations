import { Injectable } from '@nestjs/common';
import { DecisionSystem } from './models/InformationSystem';

@Injectable()
export class SummaryService {
  calculateAverageRulesLength(rules: DecisionSystem) {
    const sum = rules.reduce((acc, rule) => {
      const localSum = acc + Object.keys(rule.attributes).length;

      return localSum;
    }, 0);

    return sum / rules.length;
  }
}
