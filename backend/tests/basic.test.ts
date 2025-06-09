/// <reference types="jest" />

describe('Basic Test Suite', () => {
  it('should run a basic test successfully', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle string operations', () => {
    const message = 'Hello World';
    expect(message).toContain('World');
    expect(message.length).toBe(11);
  });

  it('should work with async operations', async () => {
    const promise = Promise.resolve('test');
    const result = await promise;
    expect(result).toBe('test');
  });
});
