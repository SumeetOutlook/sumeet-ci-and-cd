import { Injectable } from '@angular/core';
import * as Forge from 'node-forge';

@Injectable({
    providedIn: 'root'
})
export class RSAHelper {

    publicKey: string = `-----BEGIN PUBLIC KEY-----
    MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHjIeQhELEZsZk631Yd1BejasQQX
    5dK0l55jHc+x8PUKs8w+9ffI5Fp858oi9J/sMECFO2bz+BhO37Yv3QB7ee1lNxWK
    PD3yWyPD97I3JgvhAu6XbX+ukWxv5VIxZhLg6/uOsH1T2G6JdDcmsoQLeQS2sU1f
    aKVkffi85fGapMsDAgMBAAE=
  -----END PUBLIC KEY-----`;

    constructor() { }

    encryptWithPublicKey(valueToEncrypt: string): string {
        const rsa = Forge.pki.publicKeyFromPem(this.publicKey);
        return window.btoa(rsa.encrypt(valueToEncrypt.toString()));
    }

}
