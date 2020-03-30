import {Component} from '@angular/core';
import {Car} from '../model/car';
import PolishVehicleRegistrationCertificateDecoder from 'polish-vehicle-registration-certificate-decoder';
import {CarStorage} from '../storage/car.storage';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
import {BarcodeScannerOptions} from '@ionic-native/barcode-scanner';
import {Platform} from '@ionic/angular';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html'
})
export class Tab1Page {

    car: Car;
    scannerOptions: BarcodeScannerOptions = {
        formats: 'AZTEC',
        prompt: 'Umieść kod w prostokącie, aby go zeskanować.'
    };

    pdfObj = null;

    constructor(private carStorage: CarStorage,
                private barcodeScanner: BarcodeScanner,
                private plt: Platform,
                private file: File,
                private fileOpener: FileOpener) {
    }

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
            this.carStorage.addItem(this.car);
        }).catch(err => {
            console.log('Barcode ERROR: ', err);
        });
    }

    createPdf() {
        var docDefinition = {
            content: [
                {text: 'Dane pojazdu', style: 'header'},
                {text: new Date().toLocaleTimeString(), alignment: 'right'},

                {
                    ul: [
                        'Numer rejestracyjny: ' + this.car.registrationNumber,
                        'Marka: ' + this.car.brand,
                        'Model: ' + this.car.model,
                        'VIN: ' + this.car.vin,
                        'Rodzaj pojazdu: ' + this.car.type,
                        "Rodzaj paliwa: " + this.car.fuel,
                        "Rok produkcji: " + this.car.productionYear,
                        "Data pierwszej rejestracji: " + this.car.firstRegistrationDate,
                        "Pojemność silnika : " + this.car.engineCapacity,
                        "Moc silnika : " + this.car.enginePower,
                        "Ilość miejsc : " + this.car.seatsNumber,
                        "Imię i nazwisko właściciela: " + this.car.ownerName,
                        "PESEL lub REGON właściciela: " + this.car.ownerPeselOrRegon,
                        "Masa własna pojazdu : " + this.car.weight,
                        "Dopuszczalna masa całkowita: " + this.car.okWeight,
                        "Maksymalna masa całkowita: " + this.car.maxWeight,
                    ]
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                },
            }
        }
        this.pdfObj = pdfMake.createPdf(docDefinition);
        this.downloadPdf();
    }

    downloadPdf() {
        if (this.plt.is('cordova')) {
            this.pdfObj.getBuffer((buffer) => {
                var blob = new Blob([buffer], {type: 'application/pdf'});

                // Save the PDF to the data Directory of our App
                this.file.writeFile(this.file.dataDirectory, this.car.model + '_' + this.car.registrationNumber +'.pdf', blob, {replace: true}).then(fileEntry => {
                    // Open the PDf with the correct OS tools
                    this.fileOpener.open(this.file.dataDirectory + this.car.model + '_' + this.car.registrationNumber +'.pdf', 'application/pdf');
                })
            });
        } else {
            // On a browser simply use download!
            this.pdfObj.download();
        }
    }
}
