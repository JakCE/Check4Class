import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header/header.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-register',
    imports: [HeaderComponent, RouterLink],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {

}
