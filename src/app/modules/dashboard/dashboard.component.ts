import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/Supabase/supabase.service';
import { AuthService } from '../../services/Auth/auth.service';

@Component({
    selector: 'app-dashboard',
    imports: [RouterLink],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
    session: any;
    dataUser: any;
    constructor(
        private supabase: SupabaseService,
        private authService: AuthService,
        private router: Router
    ){}
    ngOnInit(): void {
        this.getUserInfo();
    }
    async getUserInfo(){
        this.session = await this.authService.session();
        const id_user = this.session.data.session.user.id;
        this.supabase.getDataUser(id_user).subscribe(data => {
            this.dataUser = data;
            console.log(data);
        })
    }
    async closeSession(){
        await this.authService.signOut();
        this.router.navigateByUrl('/login');
    }
    convertMayus(val: string){
        if(val) return val.toUpperCase();
        else return;
    }
}
