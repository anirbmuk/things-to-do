import { TestBed } from '@angular/core/testing';
import { CrudService } from './crud.service';
import { StorageService } from './storage.service';

type ItemType = { foo: string };

describe('CrudService', () => {
  let mockStorageService: jasmine.SpyObj<StorageService>;
  let crudService: CrudService;
  const item: ItemType = { foo: 'bar' } as const;

  beforeEach(() => {
    mockStorageService = jasmine.createSpyObj<StorageService>(
      'StorageService',
      ['setItem', 'getItem']
    );
    TestBed.configureTestingModule({
      providers: [
        CrudService,
        { provide: StorageService, useValue: mockStorageService }
      ]
    });
    crudService = TestBed.inject(CrudService);
  });

  it('should create a TODO', async () => {
    const result = await crudService.create<ItemType>(
      item,
      undefined,
      'todos_development'
    );
    expect(mockStorageService.setItem).toHaveBeenCalledOnceWith(
      'todos_development',
      [item],
      undefined
    );
    expect(result).toEqual(item);
  });

  it('should read TODOs', async () => {
    mockStorageService.getItem.and.returnValue('[{"foo":"bar"}]');
    const result = await crudService.read<ItemType>('todos_development');
    expect(mockStorageService.getItem).toHaveBeenCalledOnceWith(
      'todos_development'
    );
    expect(result).toEqual([item]);
  });

  it('should delete a TODO', async () => {
    mockStorageService.getItem.and.returnValue('[{"foo":"bar"}]');

    const result = await crudService.delete<ItemType>(
      'foo',
      'bar',
      undefined,
      'todos_development'
    );
    expect(mockStorageService.getItem).toHaveBeenCalledOnceWith(
      'todos_development'
    );
    expect(mockStorageService.setItem).toHaveBeenCalledOnceWith(
      'todos_development',
      [],
      undefined
    );
    expect(result).toEqual(item);
  });

  it('should not delete a non-existing TODO', async () => {
    await expectAsync(
      crudService
        .delete<ItemType>('foo', 'bar', undefined, 'todos_development')
        .then()
    ).toBeRejectedWithError('[deleteItem] object with { foo: bar } not found');
    expect(mockStorageService.getItem).toHaveBeenCalledOnceWith(
      'todos_development'
    );
    expect(mockStorageService.setItem).not.toHaveBeenCalled();
  });
});
