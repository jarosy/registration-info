import {UUID} from 'angular2-uuid';

export class Car {
    id: string;
    createDate: number;
    brand: string;
    model: string;
    type: string;
    fuel: string;
    productionYear: string;
    firstRegistrationDate: string;
    registrationNumber: string;
    vin: string;
    engineCapacity: string;
    enginePower: string;
    ownerName: string;
    ownerPeselOrRegon: string;
    seatsNumber: string;
    weight: string;
    maxWeight: string;
    okWeight: string;

    constructor() {
        this.id = UUID.UUID();
        this.createDate = new Date().getTime();
    }
}