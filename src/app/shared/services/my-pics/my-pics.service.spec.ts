import { TestBed } from '@angular/core/testing';

import { MyPicsService } from './my-pics.service';

describe('MyPicsService', () => {
  let service: MyPicsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyPicsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
