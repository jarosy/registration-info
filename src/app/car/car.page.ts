import { Component, OnInit } from '@angular/core';
import {CarStorage} from '../storage/car.storage';
import {Car} from '../model/car';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-car',
  templateUrl: './car.page.html'
})
export class CarPage implements OnInit {

  car: Car;

  constructor(private carStorage: CarStorage,
              private route: ActivatedRoute) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.carStorage.getItem(id).then(car => {
      this.car = car;
    })
  }

}
