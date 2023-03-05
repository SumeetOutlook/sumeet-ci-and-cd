import { Injectable } from '@angular/core';
// import { isEmpty, isUndefined } from '../../_utils/Common';
import { SessionStorage } from './sessionstorage';
import { LocalStorage } from './localstorage';
import { Constants } from './constants';
import { LocalStoreService } from "../../shared/services/local-store.service";


@Injectable()
export class ManagerService {

    constructor(
        private session: SessionStorage,
        private local: LocalStorage,
        private ls :LocalStoreService
    ) { }

    public set(storageType, key: string, value: any) {
        switch (storageType) {
            case Constants.SESSSION_STORAGE:
                this.local.set(key, value); //this.session.set(key, value);
                break;
            case Constants.LOCAL_STORAGE:
                this.local.set(key, value);
                break;
            default:
                break;
        }
    }

    public get(storageType, key: string) {
        let data;
        switch (storageType) {
            case Constants.SESSSION_STORAGE:
                data = this.local.get(key); //data = this.session.get(key);
                break;
            case Constants.LOCAL_STORAGE:
                data = this.local.get(key);
                break;
            default:
                break;
        }
        return data;
    }

    // public isExists(storageType, key: string): boolean {
    //     const v = this.get(storageType, key);
    //     return !isUndefined(v) && !isEmpty(v);
    // }

    public clearDB(): void {
        console.log("clear");
        debugger;
        var header = this.ls.getItem('Headers');
        var resource  = this.ls.getItem('Resource');
        this.session.clear();
        this.local.clear();
        this.ls.setItem('Headers', header);
        this.ls.setItem('Resource', resource);
    }    
}

