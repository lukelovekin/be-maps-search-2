import { config } from 'dotenv';
import { ConfigService } from './config-service';
import { MissingConfigException } from '../../exceptions/common-exceptions';

config()

describe('ConfigService', () => {
  it('should be defined', () => {
    expect(() => new ConfigService()).toBeDefined();
  });
  it('should throw MissingConfigException if apiKey there isnt one', () => {
    process.env.TOMTOM_API_KEY = ''
    expect(() => new ConfigService()).toThrow(MissingConfigException);
  })
});