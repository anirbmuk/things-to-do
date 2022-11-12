import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  setItem<T = unknown>(key: string, value: T) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string) {
    return window.localStorage.getItem(key);
  }
}
