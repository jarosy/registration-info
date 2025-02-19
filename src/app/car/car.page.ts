import {Component, OnInit} from '@angular/core';
import {CarStorage} from '../storage/car.storage';
import {Car} from '../model/car';
import {ActivatedRoute} from '@angular/router';
import {Platform} from '@ionic/angular';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

@Component({
    selector: 'app-car',
    templateUrl: './car.page.html'
})
export class CarPage implements OnInit {

    pdfObj: any;
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

    createPdf() {
        var docDefinition = {
            content: [
                {text: 'Dane pojazdu', style: 'header'},
                {text: new Date().toLocaleString(), alignment: 'right'},

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
                ul: {
                    fontSize: 14
                }
            }
        };
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
