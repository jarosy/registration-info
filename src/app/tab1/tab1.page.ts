import { Component } from '@angular/core';
import {Car} from '../model/car';
import PolishVehicleRegistrationCertificateDecoder from 'polish-vehicle-registration-certificate-decoder';
import {CarStorage} from '../storage/car.storage';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html'
})
export class Tab1Page {

  car: Car;

  constructor(private carStorage: CarStorage,
              private barcodeScanner: BarcodeScanner) {}

    scan() {
        this.barcodeScanner.scan(this.scannerOptions).then(barcodeData => {
            this.car = new Car();
            const decoder = new PolishVehicleRegistrationCertificateDecoder(barcodeData.text);
            this.car.registrationNumber = decoder.data.numerRejestracyjnyPojazdu.value;
            this.car.vin = decoder.data.numerIdentyfikacyjnyPojazdu.value;
            this.car.brand = decoder.data.markaPojazdu.value;
            this.car.model = decoder.data.modelPojazdu.value;
            this.car.type = decoder.data.rodzajPojazdu.value;
            this.car.fuel = decoder.data.rodzajPaliwa.valueDescription;
            this.car.productionYear = decoder.data.rokProdukcji.value;
            this.car.firstRegistrationDate = decoder.data.dataPierwszejRejestracjiPojazdu.value;
            this.car.engineCapacity = decoder.data.pojemnoscSilnikaCm3.value;
            this.car.enginePower = decoder.data.maksymalnaMocNettoSilnikaKW.value;
            this.car.seatsNumber = decoder.data.liczbaMiejscSiedzacych.value;
            this.car.weight = decoder.data.masaWlasnaPojazduKg.value;
            this.car.maxWeight = decoder.data.maksymalnaMasaCalkowitaPojazduKg.value;
            this.car.okWeight = decoder.data.dopuszczalnaMasaCalkowitaPojazduKg.value;
            this.car.ownerName = decoder.data.pelneNazwiskoLubNazwaPosiadaczaDowoduRejestracyjnego.value;
            this.car.ownerPeselOrRegon = decoder.data.numerPESELLubREGONPosiadaczaDowoduRejestracyjnego.value;
            this.carStorage.addItem(car);
        }).catch(err => {
            console.log('Barcode ERROR: ', err);
        });
    }

}
