import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header/header.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-mantenedores-menu',
    imports: [HeaderComponent, RouterLink],
    templateUrl: './mantenedores-menu.component.html',
    styleUrl: './mantenedores-menu.component.css'
})
export class MantenedoresMenuComponent {

}
