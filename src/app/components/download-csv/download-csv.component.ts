import { Component, OnInit } from '@angular/core';
import { FileDownloadService } from '../../services/file-download.service';
import { LostCall } from '../../models/lost-call';
import { CsvService } from '../../services/csv.service';

@Component({
  selector: 'app-download-csv',
  templateUrl: './download-csv.component.html',
  styleUrls: ['./download-csv.component.css'],
  providers: [FileDownloadService, CsvService]
})
export class DownloadCsvComponent implements OnInit {
  public lostCalls: Array<LostCall>;

  constructor(
    private _fileDownloadService: FileDownloadService,
    private _csvService: CsvService
  ) { }

  settings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false
    }, 
    columns: {
      numero: {
        title: 'Número', filter: false
      },
      motivo: {
        title: 'Motivo', filter: false
      },
    },
    noDataMessage: "No se encontraron datos para mostrar"
  };

  downloadCsv(){
    this._csvService.downloadFile(this.lostCalls, 'perdidas');
  }

  ngOnInit(): void {
    this.getFile();
  }

  getFile(){
    this._fileDownloadService.downloadFile().subscribe(
      response => {
        this.lostCalls = response;
      },
      error => {
        console.log(<any>error);
      }
    )
  }  
}
