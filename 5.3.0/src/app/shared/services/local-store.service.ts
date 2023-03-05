import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStoreService {

  private ls = window.localStorage;
  public localArray = [];

  constructor() { }

  public setItem(key, value) {
    value = JSON.stringify(value)
    this.ls.setItem(key, value)
    return true
  }

  public getItem(key) {
    let value = this.ls.getItem(key)
    try {
      return JSON.parse(value)
    } catch (e) {
      return null
    }
  }
  
  public clear() {
    this.ls.clear();
  }

  public setData(dataArray) {
    this.localArray = dataArray;
  }

  public getData() {
    return this.localArray;
  }

  public clearDataArray() {
    this.localArray = [];
    return this.localArray;
  }
}