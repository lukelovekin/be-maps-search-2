import { ConfigService } from '../../services/config-service/config-service';
import { LoggerService } from '../../services/logger-service/logger-service';
import axios from 'axios';
import { SearchOptions } from '../../../generated/maps-search';
import { FuzzySearchRS, FuzzySearchResult } from '../../../generated/tomtom';

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

    const internalServerErrorCodes = [400, 403, 404, 405, 596] 

    const noResults: FuzzySearchRS = { results: [] }

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
            countrySet: options.countrySet,
          },
        });

        const isExpectedRS = (searchData as FuzzySearchRS).results !== undefined

        if(!isExpectedRS) throw new Error(`Unexpected or Error response received for fuzzySearch: ${searchData}`);

        const isExternalServerError = status > 499 && status < 600 && !internalServerErrorCodes.includes(status)

        if(status === tooManyRequestsStatusCode) {
          const retryAfter = parseInt(headers['retry-after'], 10) || this.config.fuzzySearchRetryInSecs; // retry after x seconds if client server doesnt specify

          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000)); // pause execution
          continue
        }

        if(internalServerErrorCodes.includes(status)) throw new Error('Internal Server Error')

        if(isExternalServerError) throw new Error('External Server Error')

        const filteredResults = searchData?.results?.filter((result: FuzzySearchResult) => {
          const hasMatchingCountryCode = result?.address?.countryCode === options.countrySet

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