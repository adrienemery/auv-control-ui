import {Component} from '@angular/core' 
import { AuvService } from '../auv/auv.service';

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.css'],
  templateUrl: './dashboard.html'
})
export class DashboardComponent {
  constructor(private auv: AuvService) {}

  turnRight(event) {
    console.log(event);
    this.auv.turnRight();
  }; 
  
  turnLeft(event) {
    console.log(event);
    this.auv.turnLeft();
  }
}
