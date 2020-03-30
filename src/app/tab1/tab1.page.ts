import {Component} from '@angular/core';
import {Car} from '../model/car';
import PolishVehicleRegistrationCertificateDecoder from 'polish-vehicle-registration-certificate-decoder';
import {CarStorage} from '../storage/car.storage';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
import {BarcodeScannerOptions} from '@ionic-native/barcode-scanner';
import {FileOpener} from '@ionic-native/file-opener/ngx';
import {Platform} from '@ionic/angular';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

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
                {text: 'REMINDER', style: 'header'},
                {text: new Date().toTimeString(), alignment: 'right'},

                {text: 'From', style: 'subheader'},

                {text: 'To', style: 'subheader'},

                {text: 'Hello', style: 'story', margin: [0, 20, 0, 20]},

                {
                    ul: [
                        'Bacon',
                        'Rips',
                        'BBQ',
                    ]
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                },
                subheader: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 15, 0, 0]
                },
                story: {
                    italic: true,
                    alignment: 'center',
                    width: '50%',
                }
            }
        }
        this.pdfObj = pdfMake.createPdf(docDefinition);
    }

    downloadPdf() {
        if (this.plt.is('cordova')) {
            this.pdfObj.getBuffer((buffer) => {
                var blob = new Blob([buffer], {type: 'application/pdf'});

                // Save the PDF to the data Directory of our App
                this.file.writeFile(this.file.dataDirectory, 'myletter.pdf', blob, {replace: true}).then(fileEntry => {
                    // Open the PDf with the correct OS tools
                    this.fileOpener.open(this.file.dataDirectory + 'myletter.pdf', 'application/pdf');
                })
            });
        } else {
            // On a browser simply use download!
            this.pdfObj.download();
        }
    }
}
