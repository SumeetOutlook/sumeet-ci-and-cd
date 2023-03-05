import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
//import { LoaderService } from "app/components/services/loader-service";
import { ManagerService } from "../../components/storage/sessionMangaer";
import { finalize, map } from "rxjs/operators";
import { MatSnackBar} from '@angular/material/snack-bar';
import { AppLoaderService } from "../../shared/services/app-loader/app-loader.service";


@Injectable()

export class LoaderInterceptor implements HttpInterceptor {
    constructor(
                public storage:ManagerService,
                public loader:AppLoaderService,
                private snack:MatSnackBar
                ) { }
               
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     
        setTimeout(() => {
           // this.loader.open();
        });
        return next.handle(req).pipe(
            finalize(() =>  {

                setTimeout(() => {
                    //this.loader.close();                     
                });
            })
        );

      }
      openSnackBar(message: string, action: string) {
        this.snack.open(message, action, {
          duration: 2000,
        });
      }
}



