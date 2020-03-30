import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Car} from '../model/car';

const DATABASE_KEY = 'car_';

@Injectable({
    providedIn: 'root'
})
export class CarStorage {

    constructor(private storage: Storage) { }

    async addItem(item: Car): Promise<any> {
        return this.storage.set(DATABASE_KEY + item.id, item);
    }

    async setItems(items: Car[]): Promise<any> {
        let promises = [];
        await this.clearItems();
        items.forEach(item => {
            promises.push(this.storage.set(DATABASE_KEY + item.id, item));
        });
        return Promise.all(promises);
    }

    async getItems(): Promise<Car[]> {
        let promises = [];
        let keys = await this.storage.keys();
        keys.forEach((key: string) => {
            if (key.indexOf(DATABASE_KEY) === 0) {
                promises.push(this.storage.get(key));
            }
        });

        return Promise.all(promises);
    }

    async getItem(id: string): Promise<Car> {
        return this.storage.get(DATABASE_KEY + id);
    }

    async updateItem(item: Car): Promise<any> {
        return this.storage.set(DATABASE_KEY + item.id, item);
    }

    async deleteItem(id: string): Promise<Car[]> {
        return this.storage.remove(DATABASE_KEY + id);
    }

    async clearItems(): Promise<Car[]> {
        let promises = [];
        let keys = await this.storage.keys();
        keys.forEach((key: string) => {
            if (key.indexOf(DATABASE_KEY) === 0) {
                promises.push(this.storage.remove(key));
            }
        });

        return Promise.all(promises);
    }
}