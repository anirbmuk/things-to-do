import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  setItem<T = unknown>(
    key: string,
    value: T,
    replacer?: (number | string)[] | undefined
  ) {
    window.localStorage.setItem(key, JSON.stringify(value, replacer));
  }

  getItem(key: string) {
    return window.localStorage.getItem(key);
  }
}
