import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCreate } from './list-create';

describe('ListCreate', () => {
  let component: ListCreate;
  let fixture: ComponentFixture<ListCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
