import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APIConstants } from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';
import * as headers from '../../../assets/Headers.json';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Injectable({
    providedIn: 'root'
})
export class AllPathService {

    header: any;
    FileName:any;
    Fullpath:any;

    constructor(private http: HttpClient,private jwtAuth : JwtAuthService) 
    {
        this.header = this.jwtAuth.getHeaders()
     }

    DownloadTemplateExcel(Name) {
           
      if(Name =="ApplicationType"){

        var path = APIConstants.DOWNLOADTEMPLATE;
        this.FileName  =  this.header.ApplicationTypeTemplate;
       // window.open(path + this.FileName, '_blank');
      this.Fullpath=path +''+ this.FileName
       window.location.assign(this.Fullpath);

      }else if(Name =="CostCenter")
      {

        var path = APIConstants.DOWNLOADTEMPLATE;
        this.FileName  =  this.header.CostsCenterTemplate;
        this.Fullpath=path +''+ this.FileName
        window.location.assign(this.Fullpath);

      }else if(Name =="CPUClass")
      {

        var path = APIConstants.DOWNLOADTEMPLATE;
     
        this.FileName  =  this.header.CpuClassTemplate;
        this.Fullpath=path +''+ this.FileName
        window.location.assign(this.Fullpath);
       // window.open(path +  this.FileName , '_blank');

      }else if(Name =="CPUSubClass")
      {

        var path = APIConstants.DOWNLOADTEMPLATE;
        this.FileName  =  this.header.CpuSubClassTemplate;
        this.Fullpath=path +''+ this.FileName
        window.location.assign(this.Fullpath);

      //  window.open(path + this.FileName, '_blank');

      }else if(Name =="Manufacturer")
      {
      
        var path = APIConstants.DOWNLOADTEMPLATE;
        this.FileName  = this.header.ManufacturerTemplate;
        this.Fullpath=path +''+ this.FileName
        window.location.assign(this.Fullpath);

       // window.open(path + this.FileName , '_blank');

      }
      else if(Name =="Modal")
      {
      
        var path = APIConstants.DOWNLOADTEMPLATE;
        this.FileName  = this.header.ModelTemplate;
        this.Fullpath=path +''+ this.FileName
        window.location.assign(this.Fullpath);
       // window.open(path + this.FileName , '_blank');

      }else if(Name =="OperatingSystem")
      {
      
        var path = APIConstants.DOWNLOADTEMPLATE;
        this.FileName  = this.header.OperatingSystemTemplate;
        this.Fullpath=path +''+ this.FileName
        window.location.assign(this.Fullpath);
       // window.open(path + this.FileName , '_blank');

      }else if(Name =="Vendor")
      {
      
        var path = APIConstants.DOWNLOADTEMPLATE;
        this.FileName  = this.header.SupplierTemplate;
        this.Fullpath=path +''+ this.FileName
        window.location.assign(this.Fullpath);
      //  window.open(path + this.FileName , '_blank');

      }else if(Name =="AssetClass")
      {
      
        var path = APIConstants.DOWNLOADTEMPLATE;
        this.FileName  = this.header.AssetClassrTemplate;
        this.Fullpath=path +''+ this.FileName
        window.location.assign(this.Fullpath);
      //  window.open(path + this.FileName , '_blank');

      } 
      
      else if(Name == "SBU") {
          var path = APIConstants.DOWNLOADTEMPLATE;
          this.FileName = this.header.SBUTemplate;
          this.Fullpath = path + '' + this.FileName
          window.location.assign(this.Fullpath);
      }
             
      else if(Name == "Rack") {
          var path = APIConstants.DOWNLOADTEMPLATE;
          this.FileName = this.header.LocationTemplate;
          this.Fullpath = path + '' + this.FileName
          window.location.assign(this.Fullpath);
      }
             
      else if(Name == "Location") {
          var path = APIConstants.DOWNLOADTEMPLATE;
          this.FileName = this.header.DepartmentTemplate;
          this.Fullpath = path + '' + this.FileName
          window.location.assign(this.Fullpath);
      }
             
      else if(Name == "AssetCategory") {
          var path = APIConstants.DOWNLOADTEMPLATE;
          this.FileName = this.header.CategoryTemplate;
          this.Fullpath = path + '' + this.FileName
          window.location.assign(this.Fullpath);
      }
             
      else if(Name == "AssetSubType") {
          var path = APIConstants.DOWNLOADTEMPLATE;
          this.FileName = this.header.SubTypeOfAssetTemplate;
          this.Fullpath = path + '' + this.FileName
          window.location.assign(this.Fullpath);
      }
             
      else if(Name == "AssetType") {
          var path = APIConstants.DOWNLOADTEMPLATE;
          this.FileName = this.header.TypeOfAssetTemplate;
          this.Fullpath = path + '' + this.FileName
          window.location.assign(this.Fullpath);
      }

      else if(Name == "Employee") {
        var path = APIConstants.DOWNLOADTEMPLATE;
        this.FileName = this.header.EmployeeTemplate;
        this.Fullpath = path + '' + this.FileName
        window.location.assign(this.Fullpath);
    }
             
    }

    DownloadExcelGrnAsset(selectedPath)
    {
     
      var path = APIConstants.DOWNLOADEXCELFILE;
      this.Fullpath=path +''+ selectedPath
      window.location.assign(this.Fullpath);

    }
    DownloadExportFile(path)
    {
            
      this.Fullpath= APIConstants.DOWNLOADEXPORTFILE +''+ path ;
      window.location.assign(this.Fullpath);
    }

    DownloadUploadDocument(path)
    {    
        
      this.Fullpath= APIConstants.DOWNLOADEXCELFILE +''+ path ;
      window.open(this.Fullpath, "_blank");
      //window.location.assign(this.Fullpath);
      //window.location.href = this.Fullpath ;
    }

    ViewDocument(path)
    {    
        
      this.Fullpath= APIConstants.DOWNLOADEXCELFILE +''+ path ;
      window.open(this.Fullpath, "_blank");
    }

    ViewATFandADF(path)
    {    
        
      this.Fullpath= APIConstants.DOWNLOADEXCELFILE +''+ path ;
      // window.open(this.Fullpath, "_blank");
      // window.location.assign(this.Fullpath);
      window.open(this.Fullpath, "_blank");
    }

}
