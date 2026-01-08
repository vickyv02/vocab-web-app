import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAdd } from './list-add';

describe('ListAdd', () => {
  let component: ListAdd;
  let fixture: ComponentFixture<ListAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
