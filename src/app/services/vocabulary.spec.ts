import { TestBed } from '@angular/core/testing';

import { VocabularyService } from './vocabulary';

describe('Vocabulary', () => {
  let service: VocabularyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VocabularyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
