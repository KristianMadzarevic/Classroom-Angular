/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AssignerService } from './assigner.service';

describe('Service: Assigner', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssignerService]
    });
  });

  it('should ...', inject([AssignerService], (service: AssignerService) => {
    expect(service).toBeTruthy();
  }));
});
