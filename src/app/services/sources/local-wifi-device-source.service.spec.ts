import { TestBed } from '@angular/core/testing';

import { LocalWifiDeviceSourceService } from './local-wifi-device-source.service';

describe('LocalWifiDeviceSourceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalWifiDeviceSourceService = TestBed.get(LocalWifiDeviceSourceService);
    expect(service).toBeTruthy();
  });
});
