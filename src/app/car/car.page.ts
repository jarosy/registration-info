import {Component, OnInit} from '@angular/core';
import {CarStorage} from '../storage/car.storage';
import {Car} from '../model/car';
import {ActivatedRoute} from '@angular/router';
import {Platform} from '@ionic/angular';
import {FileOpener} from '@ionic-native/file-opener/ngx';

@Component({
    selector: 'app-car',
    templateUrl: './car.page.html'
})
export class CarPage implements OnInit {

    car: Car;

    constructor(private carStorage: CarStorage,
                private route: ActivatedRoute,
                private plt: Platform,
                private file: File,
                private fileOpener: FileOpener) {
    }

    ngOnInit() {
        let id = this.route.snapshot.paramMap.get('id');
        this.carStorage.getItem(id).then(car => {
            this.car = car;
        })
    }

}
