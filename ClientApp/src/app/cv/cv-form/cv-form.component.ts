import { Component, OnInit } from '@angular/core';
import { CvService } from '../../shared/cv.service';
import { NgForm } from '@angular/forms';
import { FileUploader, FileUploaderOptions, FileItem } from 'ng2-file-upload';
import { ReactiveFormsModule,FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-cv-form',
  templateUrl: './cv-form.component.html',
  styles: [
  ]
})
export class CvFormComponent implements OnInit {
  public uploader: FileUploader;
  validateEmail = true;
  isValidated = true;
  public files: File[] = [];
  message: string = "";
  serverMessage: string = "";
  success = false;
  form: NgForm;
  private _uploaderOptions: FileUploaderOptions = {};

  constructor(public service: CvService) {
  }

  ngOnInit(): void { 
    this.initFileUploader();
  }
 
  initFileUploader(): void {
    this.uploader = new FileUploader({ url: this.service._baseUrl });
    this._uploaderOptions.autoUpload = false;
    this._uploaderOptions.removeAfterUpload = true;
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onBuildItemForm = (fileItem: FileItem, form: any) => {
      form.append('first_name', this.service.formData.first_name);
      form.append('last_name', this.service.formData.last_name);
      form.append('email', this.service.formData.email);
      form.append('phone_number', this.service.formData.phone_number);
      form.append('about_you', this.service.formData.about_you);
      form.append('git_profile', this.service.formData.git_profile);
      form.append('live_in_us', this.service.formData.live_in_us);
      form.append('cv', this.files[0], this.files[0].name);
      if (this.files.length>1)
        form.append('cover_letter', this.files[1], this.files[1].name);
    };

    this.uploader.onSuccessItem = (item, response, status) => {
      console.log(response)
      const resp = JSON.parse(response);
      if (resp.statusCode == 200) {
        this.success = true;
        this.service.resetForm();
      } else {
        this.success = false;
        this.serverMessage = resp.message;
      }
    };

    this.uploader.setOptions(this._uploaderOptions);
  }
  onSubmit(form: NgForm) {
    if (this.isFormValid()) {
      this.uploader.addToQueue([this.files[0]]);
      this.uploader.uploadAll();
    }
  }
  onFileChanged(event: any) {
    this.uploader.clearQueue();
    this.files.push(event.target.files[0]);
  }
  //validating form using typescript(angular) side to just show case possible ways
  isFormValid() {
    this.isValidated = true;
    if (this.service.formData.phone_number.length > 12) {
      this.isValidated = false;
      this.message = "Phone number should be 12 digit long.\n";
    }
    if (this.service.formData.first_name.length > 20) {
      this.isValidated = false;
      this.message = "First name should be 20 characters long\n";
    }
    if (this.service.formData.last_name.length > 20) {
      this.isValidated = false;
      this.message = "Last name should be 20 characters long\n";
    }
    if (this.service.formData.about_you.length > 500) {
      this.isValidated = false;
      this.message = "About you should be 500 characters long\n";
    }
    return this.isValidated;
  }

    
}
