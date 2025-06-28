import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MYproductsComponent } from './myproducts.component';

describe('MYproductsComponent', () => {
  let component: MYproductsComponent;
  let fixture: ComponentFixture<MYproductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MYproductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MYproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
