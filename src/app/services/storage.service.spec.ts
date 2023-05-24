import { StorageService } from './storage.service';

class MockService {
  private store: Record<string, string> = {};
  getItem(key: string) {
    return this.store[key];
  }
  setItem(key: string, value: string) {
    this.store[key] = value;
  }
}

describe('StorageService', () => {
  let storageService: StorageService;
  let mockService: MockService;
  const item = { foo: 'bar' } as const;

  beforeEach(() => {
    storageService = new StorageService();
    mockService = jasmine.createSpyObj<MockService>('MockService', [
      'setItem',
      'getItem'
    ]);
    Object.defineProperty(window, 'localStorage', {
      value: mockService
    });
  });

  it('should call localstorage setItem', () => {
    storageService.setItem('item', item);

    expect(mockService.setItem).toHaveBeenCalledOnceWith(
      'item',
      JSON.stringify(item)
    );
  });

  it('should call localstorage getItem', () => {
    storageService.getItem('item');

    expect(mockService.getItem).toHaveBeenCalledOnceWith('item');
  });
});
