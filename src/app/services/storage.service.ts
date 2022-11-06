import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

const EMPTY_ARRAY = '[]';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  addItem<T>(item: T) {
    return new Promise<T | undefined>((resolve, reject) => {
      if (!window) {
        return reject('Window object is undefined');
      }
      const items =
        window.localStorage.getItem(environment.dbname) || EMPTY_ARRAY;
      const cleanedItems = JSON.parse(items) as T[];
      const updatedItems = [...cleanedItems, item];
      window.localStorage.setItem(
        environment.dbname,
        JSON.stringify(updatedItems)
      );
      resolve(item);
    });
  }

  deleteItem<T>(id: keyof T, key: unknown) {
    return new Promise<T | undefined>((resolve, reject) => {
      if (!window) {
        return reject('Window object is undefined');
      }
      const items =
        window.localStorage.getItem(environment.dbname) || EMPTY_ARRAY;
      const parsedItems = JSON.parse(items) as T[];
      const itemToBeDeleted = parsedItems.find(each => each[id] === key);
      if (!itemToBeDeleted) {
        return reject(
          `[deleteItem] object with { ${String(id)}: ${key} } not found`
        );
      }
      const updatedItems = parsedItems.filter(each => each[id] !== key);
      window.localStorage.setItem(
        environment.dbname,
        JSON.stringify(updatedItems)
      );
      resolve(itemToBeDeleted);
    });
  }

  updateItem<T, U>(id: keyof T, key: unknown, item: U) {
    return new Promise<T | undefined>((resolve, reject) => {
      if (!window) {
        return reject('Window object is undefined');
      }
      const items =
        window.localStorage.getItem(environment.dbname) || EMPTY_ARRAY;
      const parsedItems = JSON.parse(items) as T[];
      const itemToBeUpdated = parsedItems.find(each => each[id] === key);
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
        ...parsedItems.filter(each => each[id] !== key),
        updatedItem
      ];
      window.localStorage.setItem(
        environment.dbname,
        JSON.stringify(updatedItems)
      );
      resolve(updatedItem);
    });
  }

  getItems<T>() {
    return new Promise<T[]>((resolve, reject) => {
      if (!window) {
        return reject('Window object is undefined');
      }
      const items =
        window.localStorage.getItem(environment.dbname) || EMPTY_ARRAY;
      const parsedItems = JSON.parse(items) as T[];
      resolve(parsedItems);
    });
  }

  removeAll() {
    return new Promise<void>((resolve, reject) => {
      if (!window) {
        return reject('Window object is undefined');
      }
      window.localStorage.setItem(environment.dbname, JSON.stringify([]));
      resolve();
    });
  }
}
