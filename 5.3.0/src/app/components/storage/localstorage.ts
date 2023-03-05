import { Injectable } from "@angular/core";

@Injectable()
export class LocalStorage {
    
    public set = (key: string, val: string) => localStorage.setItem(key, val);
    public get = (key: string) => localStorage.getItem(key);
    public clear = () => localStorage.clear();

}
