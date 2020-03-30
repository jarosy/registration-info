import {Component} from '@angular/core';
import {CarStorage} from '../storage/car.storage';
import {Car} from '../model/car';
import {NavController} from '@ionic/angular';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html'
})
export class Tab2Page {

    cars: Car[] = [];

    constructor(private carStorage: CarStorage,
                private navController: NavController) {
    }

    ionViewWillEnter() {
        this.carStorage.getItems().then(cars => {
            this.cars = cars;
        });
    }

    goToCar(id: string) {
        this.navController.navigateForward('car/' + id)
    }

    deleteCar(id: string) {
        this.carStorage.deleteItem(id).then(() => {
            let index = this.cars.findIndex(c => c.id == id);
            if (index > -1) {
                this.cars.splice(index, 1);
            }
        });
    }


}
