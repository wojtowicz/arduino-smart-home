import { TestBed } from '@angular/core/testing';

import { RemoteDeviceConnectService } from './remote-device-connect.service';

describe('RemoteDeviceConnectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RemoteDeviceConnectService = TestBed.get(RemoteDeviceConnectService);
    expect(service).toBeTruthy();
  });
});
