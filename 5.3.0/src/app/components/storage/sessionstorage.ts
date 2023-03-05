import { Injectable } from "@angular/core";

@Injectable()
export class SessionStorage {

    public set = (key: string, val: string) => sessionStorage.setItem(key, val);
    public get = (key: string) => sessionStorage.getItem(key);
    public clear = () => sessionStorage.clear();

}
