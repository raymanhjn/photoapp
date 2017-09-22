import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GvisionProvider {
  headers = new Headers({'Content-Type' : 'application/json'});
  options = new RequestOptions({ headers: this.headers });
  API_KEY = "AIzaSyDRgu_6xNGoVzR81dLP2LD2Pl4si3c0MVg";
  url = 'https://vision.googleapis.com/v1/images:annotate?key='+this.API_KEY;
  request = JSON.stringify({
    "requests": [
      {
        "features": [
          {
            "type": "LABEL_DETECTION"
          }
        ],
        "image": {
          "source": {
            "imageUri": "gs://photoapp_images/demo-image.jpg"
          }
        }
      }
    ]
  });
  constructor(public http: Http) {
    console.log('Hello GvisionProvider Provider');
  }


  getImageInfo() {
    this.http.post(this.url, this.request, this.options)
      .subscribe( data => {
        console.log(data);
      }, err => {
        console.log(err);
      });
  }
}
