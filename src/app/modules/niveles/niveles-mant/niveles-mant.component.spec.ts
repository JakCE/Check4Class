import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelesMantComponent } from './niveles-mant.component';

describe('NivelesMantComponent', () => {
  let component: NivelesMantComponent;
  let fixture: ComponentFixture<NivelesMantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NivelesMantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NivelesMantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
