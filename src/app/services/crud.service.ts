import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

const EMPTY_ARRAY = '[]';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  private readonly storageService = inject(StorageService);

  create<T>(item: T, storage = environment.dbname) {
    return new Promise<T | undefined>((resolve, reject) => {
      if (!window) {
        return reject('Window object is undefined');
      }
      const items = this.storageService.getItem(storage) || EMPTY_ARRAY;
      const cleanedItems = JSON.parse(items) as T[];
      const updatedItems = [...cleanedItems, item];
      this.storageService.setItem(storage, updatedItems);
      resolve(item);
    });
  }

  read<T>(storage = environment.dbname) {
    return new Promise<T[]>((resolve, reject) => {
      if (!window) {
        return reject('Window object is undefined');
      }
      const items = this.storageService.getItem(storage) || EMPTY_ARRAY;
      const parsedItems = JSON.parse(items) as T[];
      resolve(parsedItems);
    });
  }

  update<T, U>(
    id: keyof T,
    key: unknown,
    item: U,
    storage = environment.dbname
  ) {
    return new Promise<T | undefined>((resolve, reject) => {
      if (!window) {
        return reject('Window object is undefined');
      }
      const items = this.storageService.getItem(storage) || EMPTY_ARRAY;
      const parsedItems = JSON.parse(items) as T[];
      const itemToBeUpdated = parsedItems.find((each) => each[id] === key);
      if (!itemToBeUpdated) {
        return reject(
          `[updateItem] object with { ${String(id)}: ${key} } not found`
        );
      }
      const updatedItem = {
        ...itemToBeUpdated,
        ...item
      };
      const updatedItems = [
        ...parsedItems.filter((each) => each[id] !== key),
        updatedItem
      ];
      this.storageService.setItem(storage, updatedItems);
      resolve(updatedItem);
    });
  }

  delete<T>(id: keyof T, key: unknown, storage = environment.dbname) {
    return new Promise<T | undefined>((resolve, reject) => {
      if (!window) {
        return reject('Window object is undefined');
      }
      const items = this.storageService.getItem(storage) || EMPTY_ARRAY;
      const parsedItems = JSON.parse(items) as T[];
      const itemToBeDeleted = parsedItems.find((each) => each[id] === key);
      if (!itemToBeDeleted) {
        return reject(
          `[deleteItem] object with { ${String(id)}: ${key} } not found`
        );
      }
      const updatedItems = parsedItems.filter((each) => each[id] !== key);
      this.storageService.setItem(storage, updatedItems);
      resolve(itemToBeDeleted);
    });
  }

  deleteAll(storage = environment.dbname) {
    return new Promise<void>((resolve, reject) => {
      if (!window) {
        return reject('Window object is undefined');
      }
      this.storageService.setItem(storage, []);
      resolve();
    });
  }
}
