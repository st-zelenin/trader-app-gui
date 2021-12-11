import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../models';

@Component({
  selector: 'app-trading',
  templateUrl: './trading.component.html',
  styleUrls: ['./trading.component.scss'],
})
export class TradingComponent implements OnInit {
  public user: User;

  constructor(private readonly route: ActivatedRoute) {
    this.user = this.route.snapshot.data.user;
  }

  ngOnInit(): void {}
}
