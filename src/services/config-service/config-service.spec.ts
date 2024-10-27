import { ConfigService } from './config-service';
import { MissingConfigException } from '../../exceptions/common-exceptions';

describe('ConfigService', () => {
  it('should be defined', () => {
    process.env.TOMTOM_API_KEY='mockApiKey'
    expect(() => new ConfigService()).toBeDefined();
  });
  
  it('should throw MissingConfigException if apiKey there isnt one', () => {
    process.env.TOMTOM_API_KEY = ''
    expect(() => new ConfigService()).toThrow(MissingConfigException);
  })
});