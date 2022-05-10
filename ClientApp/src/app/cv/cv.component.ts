import { Component, OnInit } from '@angular/core';
import { CVModel } from '../shared/cv.model';
import { CvService } from '../shared/cv.service';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styles: [
  ]
})
export class CvComponent implements OnInit {

  constructor(public service: CvService) { }

  ngOnInit(): void {
  //  this.service.refreshList();
  }

  populateForm(selectedRecord: CVModel) {
    this.service.formData = Object.assign({},selectedRecord);
  }


}
