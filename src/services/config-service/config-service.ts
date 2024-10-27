import { config } from "dotenv";
import { MissingConfigException } from "../../exceptions/common-exceptions";

export class ConfigService {
  readonly apiKey: string;
  readonly apiVersion: string;
  readonly apiBaseUrl: string;
  readonly fuzzySearchTimeout: number;
  readonly fuzzySearchMaxRetries: number;
  readonly fuzzySearchRetryInSecs: number;

  // TODO replace confidential .env values with SSM path values instead and retieve via SSM

  constructor() {
    config()
    
    this.apiKey = process.env.TOMTOM_API_KEY || '';
    this.apiVersion = process.env.TOMTOM_API_VERSION || '2';
    this.apiBaseUrl = process.env.TOMTOM_API_URL || 'https://api.tomtom.com';

    this.fuzzySearchTimeout = parseInt(process.env.TOMTOM_SEARCH_TIMEOUT ?? '5000', 10)
    this.fuzzySearchMaxRetries = parseInt(process.env.TOMTOM_SEARCH_RETRY ?? '3', 10) 
    this.fuzzySearchRetryInSecs = parseInt(process.env.TOMTOM_SEARCH_RETRY ?? '1', 10) 

    if(!this.apiKey) throw new MissingConfigException('Missing Api Key')
  }

}