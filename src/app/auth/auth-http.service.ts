/* This code is adapted from https://github.com/auth0/angular2-jwt/blob/master/angular2-jwt.ts
*
*/

import { Injectable, Provider } from '@angular/core';
import { Http, Headers, Request, RequestOptions, RequestOptionsArgs, RequestMethod, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap'; 


export class AuthConfig {

    public globalHeaders: Array<Object> = [{'Content-Type':'application/json'}];
    public headerName: string = 'Authorization';
    public headerPrefix: string = 'Token ';  // use `Bearer` for jwt's
    public noJwtError: boolean = false;
    public noTokenScheme: boolean = false;
    
    public tokenName: string = 'token';
    public baseUrl: string = 'http://localhost:8000/'

    public tokenGetter(): string {
      return localStorage.getItem(this.tokenName);
    }
}

export class AuthHttpError extends Error {
}


/**
 * Allows for explicit authenticated HTTP requests.
 */

@Injectable()
export class AuthHttp {

  private config: AuthConfig;
  public tokenStream: Observable<string>;

  constructor(private http: Http, private defOpts?: RequestOptions) {
    this.config = new AuthConfig();

    this.tokenStream = new Observable<string>((obs: any) => {
      obs.next(this.config.tokenGetter());
    });
  }

  private mergeOptions(providedOpts: RequestOptionsArgs, defaultOpts?: RequestOptions) {
    let newOptions = defaultOpts || new RequestOptions();
    if (this.config.globalHeaders) {
      this.setGlobalHeaders(this.config.globalHeaders, providedOpts);
    }

    newOptions = newOptions.merge(new RequestOptions(providedOpts));

    return newOptions;
  }

  private requestHelper(requestArgs: RequestOptionsArgs, additionalOptions?: RequestOptionsArgs): Observable<Response> {
    let options = new RequestOptions(requestArgs);
    options.url = this.config.baseUrl + options.url;  // build the full url
    if (additionalOptions) {
      options = options.merge(additionalOptions);
    }
    return this.request(new Request(this.mergeOptions(options, this.defOpts)));
  }

  private requestWithToken(req: Request, token: string): Observable<Response> {
    req.headers.set(this.config.headerName, this.config.headerPrefix + token);
    return this.http.request(req);
  }

  public setGlobalHeaders(headers: Array<Object>, request: Request | RequestOptionsArgs) {
    if (!request.headers) {
      request.headers = new Headers();
    }
    headers.forEach((header: Object) => {
      let key: string = Object.keys(header)[0];
      let headerValue: string = (header as any)[key];
      (request.headers as Headers).set(key, headerValue);
    });
  }

  public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    if (typeof url === 'string') {
      return this.get(url, options); // Recursion: transform url from String to Request
    }

    // from this point url is always an instance of Request;
    let req: Request = url as Request;
    let token: string = this.config.tokenGetter();
    return this.requestWithToken(req, token);
  }

  public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.requestHelper({ body: '', method: RequestMethod.Get, url: url }, options);
  }

  public post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.requestHelper({ body: body, method: RequestMethod.Post, url: url }, options);
  }

  public put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.requestHelper({ body: body, method: RequestMethod.Put, url: url }, options);
  }

  public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.requestHelper({ body: '', method: RequestMethod.Delete, url: url }, options);
  }

  public patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.requestHelper({ body: body, method: RequestMethod.Patch, url: url }, options);
  }

  public head(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.requestHelper({ body: '', method: RequestMethod.Head, url: url }, options);
  }

  public options(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.requestHelper({ body: '', method: RequestMethod.Options, url: url }, options);
  }

}
