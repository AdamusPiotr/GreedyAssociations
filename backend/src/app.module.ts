import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArrayService } from './array.service';
import { HeuristicService } from './heuristic.service';
import { InformationSystemService } from './information-system.service';
import { SummaryService } from './summary.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    InformationSystemService,
    ArrayService,
    HeuristicService,
    SummaryService,
  ],
})
export class AppModule {}
