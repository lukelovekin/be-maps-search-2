import { ErrorRS } from './../generated/tomtom/models/ErrorRS';
import { FuzzySearchRS } from '../generated/tomtom/models/FuzzySearchRS';
import { MapsSearchRS } from './../generated/maps-search/models/MapsSearchRS';
import { TomTomClient } from './clients/tomtom/tomtom-client'
import { InvalidArgumentsException } from './exceptions/common-exceptions';
import { ConfigService } from './services/config-service/config-service'
import { LoggerService } from './services/logger-service/logger-service'
import { SearchOptions } from './clients/tomtom/types';

const logger = new LoggerService('index.ts')

const configService = new ConfigService()

export async function getAutoCompleteDetails(address: string, options: SearchOptions = {
    limit: 5,
    countrySet: 'AU',
  }): Promise<MapsSearchRS> {
    if (!address.length) throw new InvalidArgumentsException('Address search is too short');
 
    const tomtomClient = new TomTomClient(configService)
    
    try {
        const { results } = await tomtomClient.fuzzySearch( address, options );

        if (!results?.length) {
            logger.warn('Fuzzy Search didnt return any results');
            return []
          }

        const mappedResults = results?.map((result) => ({
            placeId: result.id,
            ...result.address
        }))

    return mappedResults

    } catch (error) {
        logger.error(`Fuzzy Search Failed: ${error}`);
        //? throw here or return no results
    }
    
    return []
}