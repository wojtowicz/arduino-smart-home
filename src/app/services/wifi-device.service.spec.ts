import { TestBed } from '@angular/core/testing';

import { WifiDeviceService } from './wifi-device.service';

describe('WifiDeviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WifiDeviceService = TestBed.get(WifiDeviceService);
    expect(service).toBeTruthy();
  });
});
