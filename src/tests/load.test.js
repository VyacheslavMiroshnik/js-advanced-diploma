import GameStateService from '../js/GameStateService';

class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value;
  }

  removeItem(key) {
    delete this.store[key];
  }
}
const stateService = new GameStateService(new LocalStorageMock());

beforeEach(() => {
  jest.resetAllMocks();
});

test('test', () => {
  // jest.replaceProperty(stateService,'storage', )
  stateService.storage.setItem('state', '[ddd');
  expect(() => {
    stateService.load();
  }).toThrow(new Error('Invalid state'));
});
