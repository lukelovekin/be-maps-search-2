import { ConfigService } from '../../services/config-service/config-service';
import { TomTomClient } from './tomtom-client';

// TODO test and mock when status is tooManyRequestsStatus (429)

// TODO test and mock error responses,handling and empty results

describe('TomTomClient', () => {
  it('should be defined', () => {
    expect(new TomTomClient(new ConfigService)).toBeDefined();
  });
});
