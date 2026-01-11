import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabEdit } from './vocab-edit';

describe('VocabEdit', () => {
  let component: VocabEdit;
  let fixture: ComponentFixture<VocabEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VocabEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VocabEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
