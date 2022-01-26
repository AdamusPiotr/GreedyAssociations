import { Injectable } from '@nestjs/common';
import { ArrayService } from './array.service';
import { DecisionSystem } from './models/InformationSystem';

@Injectable()
export class HeuristicService {
  constructor(private arrayService: ArrayService) {}

  m(subTable: DecisionSystem, decision: string | number) {
    return (
      subTable.length -
      this.arrayService.getAmountOfRowsWithDecisionValue(subTable, decision)
    );
  }
}
