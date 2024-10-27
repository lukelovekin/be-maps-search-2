import { MapsSearchRS, SearchOptions } from './../generated/maps-search';
import { TomTomClient } from './clients/tomtom/tomtom-client'
import { InvalidArgumentsException } from './exceptions/common-exceptions';
import { ConfigService } from './services/config-service/config-service'
import { LoggerService } from './services/logger-service/logger-service'

const logger = new LoggerService('index.ts')

const configService = new ConfigService()

export const validateSearchQuery = (query: string) => {
    const regex = /^[a-zA-Z0-9\s]+$/; // letters, numbers, white space

    const taglessQuery = query.replace(/<[^>]*>/g, ''); 

    const validQuery = taglessQuery.replace(/[^a-zA-Z0-9\s]/g, '');

    if (!validQuery.trim().length) throw new InvalidArgumentsException('searchQuery search is too short');

    if (!regex.test(validQuery)) throw new InvalidArgumentsException('Invalid characters in search query.'); 
    
    return validQuery;
}

export async function getAutoCompleteDetails(searchQuery: string, options: SearchOptions = {
    limit: 5,
    countrySet: 'AU',
  }): Promise<MapsSearchRS> {

    const validSearchQuery = validateSearchQuery(searchQuery)
 
    const tomtomClient = new TomTomClient(configService)
    
    try {
        const { results } = await tomtomClient.fuzzySearch( validSearchQuery, options );

        if (!results?.length) {
            logger.warn('Fuzzy Search didnt return any results');

            return []
          }

        const mappedResults = results?.map((result) => ({
            placeId: result?.id,
            ...result?.address
        }))

        return mappedResults

    } catch (error) {
        logger.error(`Fuzzy Search Failed: ${error}`);
        // throw error or do nothing and return empty results
    }
    
    return []
}