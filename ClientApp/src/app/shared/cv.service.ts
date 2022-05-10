import { Injectable } from '@angular/core';
import { CVModel } from './cv.model';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CvService {

  constructor(private http: HttpClient) {
    
  }
  readonly _baseUrl = "https://localhost:44388/api/CV/";

  formData: CVModel = new CVModel();
  
  resetForm() {
    this.formData.about_you = "";
    this.formData.first_name = "";
    this.formData.last_name = "";
    this.formData.live_in_us = false;
    this.formData.git_profile = "";
    this.formData.phone_number = "";
    this.formData.email = "";
  }
}
