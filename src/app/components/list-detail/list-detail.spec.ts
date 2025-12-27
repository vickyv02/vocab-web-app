import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDetail } from './list-detail';

describe('ListDetail', () => {
  let component: ListDetail;
  let fixture: ComponentFixture<ListDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
