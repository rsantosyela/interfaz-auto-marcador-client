import { Component, OnInit } from '@angular/core';
//import { UploadService } from '../../services/upload.service'
import { FileUploadService } from '../../services/file-upload.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { ThrowStmt } from '@angular/compiler';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { retry } from 'rxjs/operators';

@Component({
  selector: 'app-import-csv',
  templateUrl: './import-csv.component.html',
  styleUrls: ['./import-csv.component.css'],
  providers: [FileUploadService]
})
export class ImportCsvComponent implements OnInit {
  public fileToUpload: File;
  public fileForm: FormGroup;
  public submitted: boolean;
  public isCsv: boolean;

  private defaultValuesLoginForm = () => {
    return {
      retryTime: ['', Validators.required],
      file: [ null, Validators.required],
    };
  }

  constructor(
    //private _uploadService: UploadService,
    private _fileUploadService: FileUploadService,
    private _router: Router,
    private _ngxSmartModalService: NgxSmartModalService
  ){ 
    this.isCsv = true;
    this.fileToUpload = null;
  }

  ngOnInit(){
    //console.log(this.fileToUpload);
    
    this.resetControllers();
  }

  resetControllers(){
    this.submitted = false;
    this.fileForm = new FormBuilder().group(this.defaultValuesLoginForm());
  }

  onSubmit(){
    console.log("hey");
    console.log(this.fileToUpload);
  }
  
  reload(){
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';
    this._router.navigate(['importar-csv']);
  }

  csvJSON(csv) {
    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split(",");
    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split(",");
        for (var j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentline[j];
        }
        result.push(obj);
    }
    console.log(result);
    return result;
  }
  
  handleFileInput(files: FileList) {
    
    this.fileToUpload = files.item(0);
    var checkCsvFormat = this.checkCsvFormat();
 
    if(checkCsvFormat){

      let fileReader = new FileReader();

      fileReader.onload = (event) => {   
        
        var headersArray = (<string>fileReader.result).split(/[\s,]+/);
        
        if(headersArray[0] === "numeroCliente" &&  headersArray[1] === "horaInicio" && headersArray[2] === "reintentos" && headersArray[3] === "numeroUmo"){

          var text = fileReader.result;
          var textJson = this.csvJSON(text);
          var isFormatValid = true;

          for (let index in textJson){
            var clientNumber = parseInt(textJson[index].numeroCliente);
            if(isNaN(clientNumber) || clientNumber.toString().length !== 9){
              isFormatValid = false;
            }
            var retries = parseInt(textJson[index].reintentos);
            if(isNaN(retries)){
              isFormatValid = false;
            }
            var umoNumber = parseInt(textJson[index].numeroUmo);  
            if(isNaN(umoNumber) || umoNumber.toString().length !== 9){
              isFormatValid = false;  
            }
          }
        }

        if(!isFormatValid){
          console.log('Tipo de archivo no apto.')
          this.fileToUpload = null;     
          this.fileForm.setValue({
          file : null
        });
          this.isCsv = false;
        }
      }

      fileReader.readAsText(this.fileToUpload);

    }
  }

  checkCsvFormat(){
    var fileToUploadName = this.fileToUpload.name;   
    var splittedFileToUploadName = fileToUploadName.split('.');
    if(splittedFileToUploadName[1] !== 'csv'){
      console.log('Tipo de archivo no apto.')
      this.fileToUpload = null;     
      this.fileForm.setValue({
        file : null
      });
      this.isCsv = false;
      return false;
    }else{
      this.isCsv = true;
      return true;
    }
  }

  uploadFile(){
    this.submitted = true;
    if(!this.fileForm.valid){
      return;
    }else{
      this._fileUploadService.postFile(this.fileToUpload, this.fileForm.value.retryTime).subscribe(data => {
          this.startImportConfirmationModal();
        }, error => {
          console.log(error);
          this.reload();
      });
    }
  }

  startImportConfirmationModal(){
    this._ngxSmartModalService.getModal("importConfirmationModal").open();
  }

}
