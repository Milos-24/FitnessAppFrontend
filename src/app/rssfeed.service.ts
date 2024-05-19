import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import * as xml2js from 'xml2js';

@Injectable({
  providedIn: 'root'
})
export class RssFeedService {

  private rssUrl = 'https://feeds.feedburner.com/AceFitFacts';

  constructor(private http: HttpClient) { }

  getFeedContent(): Observable<any> {
    return this.http.get(this.rssUrl, { responseType: 'text' }).pipe(
      map((xmlString: string) => {
        return xml2js.parseStringPromise(xmlString, { trim: true, explicitArray: false });
      })
    );
  }
}
