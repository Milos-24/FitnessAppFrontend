import { TestBed } from '@angular/core/testing';

import { RssfeedService } from './rssfeed.service';

describe('RssfeedService', () => {
  let service: RssfeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RssfeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
