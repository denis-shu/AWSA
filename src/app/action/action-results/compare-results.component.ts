import { Component, OnInit } from '@angular/core';

import { ActionService } from '../action.service';
import { ActionData } from '../action-data.model';

@Component({
  selector: 'app-action-results',
  templateUrl: './action-results.component.html',
  styleUrls: ['./action-results.component.css']
})
export class ActionResultsComponent implements OnInit {
  actionData: ActionData[] = [];
  didFail = false;
  user: ActionData;
  lowerIsBetter = false;
  filter = 'age';

  constructor(private actionService: ActionService) {
  }

  ngOnInit() {
    this.user = this.actionService.userData;
    this.actionService.dataEdited.subscribe(
      () => this.user = this.actionService.userData
    );
    this.actionService.dataLoaded.subscribe(
      (data: ActionData[]) => {
        this.actionData = data;
      }
    );
    this.actionService.dataLoadFailed.subscribe(
      (didFail: boolean) => this.didFail = didFail
    );
  }

  onFilter(filter: string) {
    this.filter = filter;
  }

  onSelectLower(isBetter: boolean) {
    this.lowerIsBetter = isBetter;
  }

  getListGroupItemClass(item: ActionData) {
    if (+item[this.filter] === +this.user[this.filter]) {
      return 'list-group-item-warning';
    }
    if (this.lowerIsBetter) {
      return this.user[this.filter] < item[this.filter] ? 'list-group-item-success' : 'list-group-item-danger';
    } else {
      return this.user[this.filter] > item[this.filter] ? 'list-group-item-success' : 'list-group-item-danger';
    }
  }

  onStartSetData () {
    this.actionService.dataEdited.next(false);
  }

  onGetResults() {
    this.actionService.onRetrieveData();
  }
  onClearData() {
    this.actionService.onDeleteData();
  }
}
