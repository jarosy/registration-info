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
    engineCapacity: number;
    enginePower: number;
    ownerName: string;
    ownerPeselOrRegon: string;
    seatsNumber: number;
    weight: number;
    maxWeight: number;
    okWeight: number;

    constructor() {
        this.id = UUID.UUID();
    }
}