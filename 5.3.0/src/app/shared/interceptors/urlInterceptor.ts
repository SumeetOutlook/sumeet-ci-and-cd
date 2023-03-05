import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse , HttpErrorResponse } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { fromEvent, merge, Observable, Observer, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';

@Injectable()

export class UrlInterceptor implements HttpInterceptor {
    constructor() { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {      
        // console.log("before: ", request.url);        
        if (request.url.includes(environment.apiURL)) {
            request = request.clone({
                url: request.url,               
            });
        }

        //console.log("after: ", request.url);
        return next.handle(request)
        .pipe(
            retry(0),
            catchError((error: HttpErrorResponse) => {               
              let errorMessage = '';
              if (error.error instanceof ErrorEvent) {
                // client-side error
                errorMessage = `Error: ${error.error.message}`;
              } else {
                // server-side error
                errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
              }
              
              //window.alert(error.error);  
              this.createOnline$().subscribe(isOnline => {
                if (!isOnline)
                  alert("Please check your network connection and try again.")
                else 
                  window.alert("Oops something went wrong, please try again later.");
              });
              
              //console.clear();            
              return throwError(errorMessage);
              //window.alert(errorMessage);              
              //return throwError(errorMessage);
            })
          )
    }

    createOnline$() {
      return merge<boolean>(
        fromEvent(window, 'offline').pipe(map(() => false)),
        fromEvent(window, 'online').pipe(map(() => true)),
        new Observable((sub: Observer<boolean>) => {
          sub.next(navigator.onLine);
          sub.complete();
        }));
    }
}