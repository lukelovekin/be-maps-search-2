import { validateSearchQuery } from ".";
import { InvalidArgumentsException } from "./exceptions/common-exceptions";

describe('validateSearchQuery', () => {
  it('should throw an error for an empty query', () => {
    expect(() => validateSearchQuery('')).toThrow(InvalidArgumentsException);
  });

  it('should throw an error for a query with only whitespace', () => {
    expect(() => validateSearchQuery('   ')).toThrow(InvalidArgumentsException);
  });

  it('should return a sanitized query for valid input', () => {
    const query = '<script>alert("XSS")</script>';

    expect(validateSearchQuery(query)).toBe('alertXSS');
  });

  it('should remove invalid characters', () => {
    const query = 'hello,-_ world!';

    expect(validateSearchQuery(query)).toBe('hello world');
  });
});