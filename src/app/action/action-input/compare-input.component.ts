import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionData } from '../action-data.model';
import { NgForm } from '@angular/forms';

import { ActionService } from '../action.service';

@Component({
  selector: 'app-action-input',
  templateUrl: './action-input.component.html',
  styleUrls: ['./action-input.component.css']
})
export class ActionInputComponent implements OnInit {
  @ViewChild('actionForm') form: NgForm;
  isLoading = false;
  couldNotLoadData = false;

  constructor(private actionService: ActionService) {
  }

  ngOnInit() {
    this.actionService.dataIsLoading.subscribe(
      (isLoading: boolean) => this.isLoading = isLoading
    );
    this.actionService.dataLoadFailed.subscribe(
      (didFail: boolean) => {
        this.couldNotLoadData = didFail;
        this.isLoading = false;
      }
    );
  }

  onSubmit() {
    const data: ActionData = {
      age: this.form.value.age as number,
      cost: this.form.value.cost as number,
      income: this.form.value.income as number
    };
    this.actionService.onStoreData(data);
  }

  onFetchStoredData() {
    this.actionService.onRetrieveData(false);
  }
}
