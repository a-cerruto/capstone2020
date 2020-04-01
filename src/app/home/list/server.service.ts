import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private readonly serverProtocol: string;
  private readonly serverPort: string;
  private readonly serverHostName: string;
  private readonly serverAddress: string;

  constructor(private http: HttpClient) {
    this.serverProtocol = 'http://';
    this.serverHostName = window.location.hostname;
    this.serverPort = ':3000/list';

    this.serverAddress =
      this.serverProtocol +
      this.serverHostName +
      this.serverPort;
  }

  getSaved(id: number) {
    return this.http.post(this.serverAddress + "/saved", {id: id});
  }

}
