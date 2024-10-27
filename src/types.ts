import { Address } from "../generated/tomtom/models/Address";

export type AutoCompleteDetails = Omit<Address, 'id'> & {
  placeId: string;
}