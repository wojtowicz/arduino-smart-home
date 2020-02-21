import { TestBed } from '@angular/core/testing';

import { RemoteWifiDeviceSourceService } from './remote-wifi-device-source.service';

describe('RemoteWifiDeviceSourceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RemoteWifiDeviceSourceService = TestBed.get(RemoteWifiDeviceSourceService);
    expect(service).toBeTruthy();
  });
});
