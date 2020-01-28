import { TestBed } from '@angular/core/testing';

import { GuiHelper } from './gui.helper';

describe('GuiHelperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GuiHelper = TestBed.get(GuiHelper);
    expect(service).toBeTruthy();
  });
});
