import { TestBed } from '@angular/core/testing';

import { AppRoutingGuardService } from './app-routing-guard.service';

describe('AppRoutingGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppRoutingGuardService = TestBed.get(AppRoutingGuardService);
    expect(service).toBeTruthy();
  });
});
