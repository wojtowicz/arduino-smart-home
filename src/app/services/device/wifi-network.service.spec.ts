import { TestBed } from '@angular/core/testing';

import { WifiNetworkService } from './wifi-network.service';

describe('WifiNetworkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WifiNetworkService = TestBed.get(WifiNetworkService);
    expect(service).toBeTruthy();
  });
});
