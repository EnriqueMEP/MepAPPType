// Declaraciones globales para Jest
/// <reference types="jest" />

declare global {
  namespace NodeJS {
    interface Global {
      describe: typeof describe;
      it: typeof it;
      test: typeof test;
      expect: typeof expect;
      beforeAll: typeof beforeAll;
      afterAll: typeof afterAll;
      beforeEach: typeof beforeEach;
      afterEach: typeof afterEach;
    }
  }
}

export { };

