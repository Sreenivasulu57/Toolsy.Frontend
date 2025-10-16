import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ownersignup } from './ownersignup';

describe('Ownersignup', () => {
  let component: Ownersignup;
  let fixture: ComponentFixture<Ownersignup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ownersignup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ownersignup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
