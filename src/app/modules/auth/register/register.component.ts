import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header/header.component';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../../services/Supabase/supabase.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../services/toasteMessage/toast.service';
import { AuthService } from '../../../services/Auth/auth.service';

@Component({
    selector: 'app-register',
    imports: [HeaderComponent, ReactiveFormsModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
    dataNiveles: any = [];
    dataClasesSelect: any = [];
    formReg!: FormGroup;
    constructor(
        private supabase: SupabaseService,
        private fb: FormBuilder,
        private toastService: ToastService,
        private authService: AuthService,
    ){
        this.formReg = this.fb.group({
          nombres: [null, Validators.required],
          apellidos: [null, Validators.required],
          rol: [null, Validators.required],
          clase: [null, Validators.required],
          email: [null, Validators.required],
          password: [null, Validators.required],
          confirm_password: [null, Validators.required],
        });
    }
    ngOnInit(): void {
        this.getListNiveles();
    }
    getListNiveles(){
        this.supabase.getAllNiveles().subscribe(data => {
            this.dataNiveles = data;
        })
    }
    addClase(){
        if(this.formReg.value.clase == undefined || this.formReg.value.clase == null) {
            this.toastService.showToast('danger', "Seleccione una clase");
            return;
        }

        const claseSelected = this.dataNiveles.filter((val: any) => val.id == this.formReg.value.clase)[0];
        this.dataClasesSelect.push(claseSelected);
    }
    dropClase(item: any){
        this.dataClasesSelect = this.dataClasesSelect.filter((elemento: any) => elemento !== item);
    }
    limpiarForm(){
        this.formReg.reset();
    }
    register(){
        if(this.formReg.invalid){
            this.toastService.showToast('danger', "Formulario inválido");
            return;
        }

        const req = {
            nombre: this.formReg.value.nombres,
            apellido: this.formReg.value.apellidos,
            email: this.formReg.value.email,
            estado: 1,
            tipo_usuario: this.formReg.value.rol,
        }
        const idGrados = this.dataClasesSelect.map((objeto: any) => objeto.id);
        const email = this.formReg.value.email;
        const password = this.formReg.value.password;
        this.supabase.createUser2(email, password, req, idGrados).subscribe(data => {
            if(data.status == 201){
                this.limpiarForm();
                this.toastService.showToast('success', 'Usuario ' + req.nombre + ' registrado correctamente!');
                //this.getListNiveles();
            }
        },error => {
            this.toastService.showToast('danger', error);
        });
    }
}
