import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header/header.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-niveles-mant',
  standalone: true,
  imports: [HeaderComponent, RouterLink],
  templateUrl: './niveles-mant.component.html',
  styleUrl: './niveles-mant.component.css'
})
export class NivelesMantComponent {

}
