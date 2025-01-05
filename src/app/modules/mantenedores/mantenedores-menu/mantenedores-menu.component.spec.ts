import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedoresMenuComponent } from './mantenedores-menu.component';

describe('MantenedoresMenuComponent', () => {
  let component: MantenedoresMenuComponent;
  let fixture: ComponentFixture<MantenedoresMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedoresMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedoresMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
