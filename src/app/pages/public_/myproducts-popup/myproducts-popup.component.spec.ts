import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MYproductsPopupComponent } from './myproducts-popup.component';

describe('MYproductsPopupComponent', () => {
  let component: MYproductsPopupComponent;
  let fixture: ComponentFixture<MYproductsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MYproductsPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MYproductsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
