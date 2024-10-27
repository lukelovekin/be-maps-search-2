import { describe } from '@jest/globals'
import { getAutoCompleteDetails } from '../src'
import { TomTomClient } from '../src/clients/tomtom/tomtom-client'
import { ConfigService } from '../src/services/config-service/config-service'

// These are end-to-end tests and need an api key
describe('Tomtom Places E2E Tests', () => {
    describe('getAutoCompleteDetails', () => {
        it ('returns a promise', () => {
            const res = getAutoCompleteDetails('Charlotte Street')

            expect(res).toBeInstanceOf(Promise)
        })

        it('can fetch from the autocomplete api', async () => {
            const res = await getAutoCompleteDetails('Charlotte Street')

            const firstRes = res[0];

            expect(firstRes).toHaveProperty('placeId')
            expect(firstRes).toHaveProperty('countryCode')
            expect(firstRes).toHaveProperty('country')
            expect(firstRes).toHaveProperty('freeformAddress')
            expect(firstRes).toHaveProperty('municipality')
        })

        it('handles error', async () => {
            const res = getAutoCompleteDetails('')

            expect(res).rejects.toThrow()
        })
        const baseExpectedFields = ['placeId', 'countryCode', 'country', 'freeformAddress']

        const testCases = [
          { address: 'AU', expectedFields: [...baseExpectedFields]} ,
          { address: 'Buderim', expectedFields: [...baseExpectedFields, 'municipality']}, 
          { address: 'Eiffel Tower', expectedFields: [...baseExpectedFields, 'municipality']} ,
          { address: '32 Belleview Pde', expectedFields: [...baseExpectedFields, 'streetNumber', 'streetName', 'municipality']},  
        ];
       
          it.each(testCases)('should have expected fields for partial address: $address', async ({ address, expectedFields }) => {
            const res = await getAutoCompleteDetails( address );

            const firstRes = res[0];
        
            for (const field of expectedFields) {
              expect(firstRes).toHaveProperty(field);
            }
          });

          //TODO add negative tests
    })



    describe('getPlaceAutocomplete (aka tomtom fuzzySearch)', () => {
        const config = new ConfigService()

        let tomtomClient: TomTomClient

        beforeAll(() => {
            tomtomClient = new TomTomClient(config);
          });

        it('should handle no results', async () => {
            const res = await tomtomClient.fuzzySearch('asfasffasfasafsafs');

            expect(res.results).toStrictEqual([])
        })

        it('should only return Australian addresses', async () => {
            const res = await tomtomClient.fuzzySearch('Gloucester');

            expect(res.results?.every((result) => result.address?.country === 'Australia'))

        })

          //TODO add negative tests
    })

})
