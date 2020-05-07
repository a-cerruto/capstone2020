import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {
  private readonly serverProtocol: string;
  private readonly serverPort: string;
  private readonly serverHostName: string;
  private readonly serverAddress: string;

  constructor(private http: HttpClient) {
    this.serverProtocol = 'http://';
    this.serverHostName = window.location.hostname;
    this.serverPort = ':3000/subscriptions';

    this.serverAddress =
        this.serverProtocol +
        this.serverHostName +
        this.serverPort;
  }

  currentSubs(id: number) {
    return this.http.post(this.serverAddress, {id});
  }

  addSub(id: number, provider: string) {
    return this.http.put(this.serverAddress, {id, provider});
  }

  removeSub(id: number, provider: string) {
    return this.http.delete(this.serverAddress + '/' + id + '/' + provider);
  }

  getRecommendations(id: number, subscriptions: string[]) {
    console.log(subscriptions);
    return this.http.post(this.serverProtocol + this.serverHostName + ':3000/portal/recommendations', {id, subscriptions});
  }
}
