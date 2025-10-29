import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolCatalog } from './tool-catalog';

describe('ToolCatalog', () => {
  let component: ToolCatalog;
  let fixture: ComponentFixture<ToolCatalog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolCatalog],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolCatalog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
