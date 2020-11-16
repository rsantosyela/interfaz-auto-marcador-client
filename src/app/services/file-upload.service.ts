import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Global } from './global'; 

@Injectable()
export class FileUploadService{
    public url: string;

    constructor(
        public _http: HttpClient
    ){
        this.url = Global.url;
    }

    postFile(fileToUpload: File, retryTime: string): Observable<any> {
        const endpoint = this.url + 'import-csv';
        const formData: FormData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);
        formData.append('retryTime', retryTime);
        return this._http.post(endpoint, formData);
    }
}