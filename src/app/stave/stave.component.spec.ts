import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaveComponent } from './stave.component';

describe('StaveComponent', () => {
  let component: StaveComponent;
  let fixture: ComponentFixture<StaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
