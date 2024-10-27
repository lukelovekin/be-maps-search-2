import { ConfigService } from '../../services/config-service/config-service';
import { LoggerService } from '../../services/logger-service/logger-service';
import axios from 'axios';
import { SearchOptions } from './types';
import { FuzzySearchRS } from '../../../generated/tomtom/models/FuzzySearchRS';
import { FuzzySearchResult } from '../../../generated/tomtom/models/FuzzySearchResult';

export class TomTomClient {
  private readonly logger = new LoggerService('tomtom-client');
  constructor(
    private readonly config: ConfigService,
  ){}
 
  async fuzzySearch(
    address: string,
    options: SearchOptions = {
      limit: 100,
      countrySet: 'AU',
    },
    retries = 0
  ): Promise<FuzzySearchRS>{
    const {fuzzySearchMaxRetries} = this.config

    const tooManyRequestsStatusCode = 429

    const noResults = { results: [] }

    while (retries < Math.max(fuzzySearchMaxRetries, 1)) { // iterate at least once
      try {
        const {apiBaseUrl, apiKey, apiVersion, fuzzySearchTimeout} = this.config

        const { data: searchData, status, headers } = await axios({
          method: 'get',
          url: `${apiBaseUrl}/search/${apiVersion}/search/${address}.json`,
          timeout: fuzzySearchTimeout,
          params: {
            key: apiKey,
            limit: options.limit,
            ...(options?.countrySet ? { countrySet: options?.countrySet } : {}),
          },
        });

        if(status === tooManyRequestsStatusCode) {
          const retryAfter = parseInt(headers['retry-after'], 10) || this.config.fuzzySearchRetryInSecs; // retry after 1 second if client server doesnt specify
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000)); // pause execution
          continue
        }

        const filteredResults = searchData?.results?.filter((result: FuzzySearchResult) => {
          const hasMatchingCountryCode = result.address?.countryCode === options.countrySet

          return hasMatchingCountryCode 
        })

        return {
          results: filteredResults,
          ...searchData
        }
      } catch (error) {
        this.logger.error(`Error making fuzzySearchRequest: ${error}`)

        return noResults
      }
    }
    this.logger.warn('No fuzzySearch results')

    return noResults
  }
}