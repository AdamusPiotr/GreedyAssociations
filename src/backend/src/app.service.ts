import { Injectable, StreamableFile } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';

import { InformationSystemService } from './information-system.service';

@Injectable()
export class AppService {
  constructor(private informationSystemService: InformationSystemService) {}

  parseCsv(files: Express.Multer.File[]) {
    return files.map((file) => {
      return new Promise((res) => {
        const results = [];

        new StreamableFile(file.buffer)
          .getStream()
          .pipe(csv({ headers: false }))
          .on('headers', (headers) => headers.push(headers))
          .on('data', (data) => {
            results.push(data);
          })
          .on('end', () => {
            const systemInfo =
              this.informationSystemService.generateAssociationRulesForInformationSystem(
                results,
              );

            res({ name: file.originalname, systemInfo });
          });
      });
    });
  }

  getTable(file: Express.Multer.File) {
    const results = [];
    const headers = [];

    return new Promise((res) => {
      new StreamableFile(file.buffer)
        .getStream()
        .pipe(csv({ headers: false }))
        .on('headers', (headers) => headers.push(headers))
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', () => {
          res(results);
        });
    });
  }
}
