import { describe, it, expect } from 'vitest';
import { validateDate } from './DateTimeChecker';

describe('validateDate', () => {
  const currentYear = new Date().getFullYear();

  it('should return null for a valid date', () => {
    expect(validateDate('2023-10-26')).toBeNull();
  });

  it('should return an error message for an empty string', () => {
    expect(validateDate('')).toBe('Date field cannot be empty.');
  });

  it('should return an error for year less than 1000', () => {
    expect(validateDate('0999-12-31')).toBe(`Year must be between 1000 and ${currentYear}.`);
  });

  it('should return an error for year greater than current year', () => {
    expect(validateDate(`${currentYear + 1}-01-01`)).toBe(`Year must be between 1000 and ${currentYear}.`);
  });

  it('should return null for current year', () => {
    expect(validateDate(`${currentYear}-01-01`)).toBeNull();
  });

  it('should return null for year 1000', () => {
    expect(validateDate('1000-01-01')).toBeNull();
  });

  it('should return an error for month 0', () => {
    expect(validateDate('2023-00-01')).toBe('Invalid month.');
  });

  it('should return an error for month 13', () => {
    expect(validateDate('2023-13-01')).toBe('Invalid month.');
  });

  it('should return an error for day 0', () => {
    expect(validateDate('2023-10-00')).toBe('Invalid day for the selected month.');
  });

  it('should return an error for day 32', () => {
    expect(validateDate('2023-10-32')).toBe('Invalid day for the selected month.');
  });

  it('should return null for February 29th on a leap year', () => {
    expect(validateDate('2024-02-29')).toBeNull(); // 2024 is a leap year
  });

  it('should return an error for February 29th on a non-leap year', () => {
    expect(validateDate('2023-02-29')).toBe('Invalid day for the selected month.'); // 2023 is not a leap year
  });

  it('should return an error for April 31st', () => {
    expect(validateDate('2023-04-31')).toBe('Invalid day for the selected month.');
  });

  it('should return null for December 31st', () => {
    expect(validateDate('2023-12-31')).toBeNull();
  });
});
