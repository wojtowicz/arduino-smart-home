import { TestBed } from '@angular/core/testing';

import { DeviceConnectService } from './device-connect.service';

describe('DeviceConnectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeviceConnectService = TestBed.get(DeviceConnectService);
    expect(service).toBeTruthy();
  });
});
