import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterProductListComponent } from './filter-product-list.component';

describe('FilterProductListComponent', () => {
  let component: FilterProductListComponent;
  let fixture: ComponentFixture<FilterProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterProductListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
