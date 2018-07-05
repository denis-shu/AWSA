import { Component, OnInit } from '@angular/core';
import { ActionService } from './action.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnInit {
  doInput = true;
  constructor(private actionService: ActionService) {}
  ngOnInit() {
    this.actionService.dataEdited.subscribe(
      (edited: boolean) => this.doInput = !edited
    );
  }
}
