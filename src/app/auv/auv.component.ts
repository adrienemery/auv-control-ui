import { Component, OnInit } from '@angular/core';
import { Auv } from './auv';
import { AuvService } from './auv.service';

@Component({
    selector: 'auv-component',
    templateUrl: './auv.component.html'
})
export class AuvComponent implements OnInit {
    
    selectedAuv: Auv
    
    constructor(private auvService: AuvService) { }

    ngOnInit() {
        this.auvService.getAuvs()
                       .then(auvs => this.selectedAuv = auvs[0]);
    }

    updateAuv() {
        this.auvService.updateAuv(this.selectedAuv)
                       .then(auv => console.log(auv));
    }
}