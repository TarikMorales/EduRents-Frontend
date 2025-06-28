import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MYproductsEditpopupComponent } from './myproducts-editpopup.component';

describe('MYproductsEditpopupComponent', () => {
  let component: MYproductsEditpopupComponent;
  let fixture: ComponentFixture<MYproductsEditpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MYproductsEditpopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MYproductsEditpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
