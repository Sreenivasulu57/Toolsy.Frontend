import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolDetails } from './tool-details';

describe('ToolDetails', () => {
  let component: ToolDetails;
  let fixture: ComponentFixture<ToolDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
