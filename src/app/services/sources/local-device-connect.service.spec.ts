import { TestBed } from '@angular/core/testing';

import { LocalDeviceConnectService } from './local-device-connect.service';

describe('LocalDeviceConnectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalDeviceConnectService = TestBed.get(LocalDeviceConnectService);
    expect(service).toBeTruthy();
  });
});
