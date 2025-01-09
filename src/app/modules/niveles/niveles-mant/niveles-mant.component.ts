import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header/header.component';
import { SupabaseService } from '../../../services/Supabase/supabase.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../services/toasteMessage/toast.service';
import { AuthService } from '../../../services/Auth/auth.service';

@Component({
    selector: 'app-niveles-mant',
    imports: [HeaderComponent, ReactiveFormsModule],
    templateUrl: './niveles-mant.component.html',
    styleUrl: './niveles-mant.component.css'
})
export class NivelesMantComponent implements OnInit{
    nivelForm!: FormGroup;
    session: any;
    dataNiveles: any = [];
    isEdit: boolean = false;
    dataToEdit: any;
    constructor(
        private supabase: SupabaseService,
        private fb: FormBuilder,
        private toastService: ToastService,
        private authService: AuthService,
    ){
        this.nivelForm = this.fb.group({
          titulo: [null, Validators.required],
          descripcion: [null, Validators.required]
        });
    }
    async ngOnInit() {
        this.getListNiveles();
        this.session = await this.authService.session();
        console.log(this.session);
    }

    getListNiveles(){
        this.supabase.getAllNiveles().subscribe(data => {
            this.dataNiveles = data;
        })
    }

    limpiarForm(){
        this.nivelForm.reset();
        this.isEdit = false;
        this.dataToEdit = {};
    }

    saveForm(){
        const req = {
            titulo: this.nivelForm.value.titulo,
            descripcion: this.nivelForm.value.descripcion,
            estado: true,
            userId: this.session.data.session.user.id
        }
        this.supabase.createNiveles(req).subscribe(data => {
            if(data == null){
                this.limpiarForm();
                this.toastService.showToast('success', 'Nivel ' + req.titulo + ' registrado correctamente!');
                this.getListNiveles();
            }
            console.log(data);
        },error => {
            this.toastService.showToast('danger', error);
        });
    }

    assignUpdate(element: any){
        console.log(element);
        this.dataToEdit = element;
        this.isEdit = true;
        this.nivelForm.get("titulo")?.setValue(element.titulo);
        this.nivelForm.get("descripcion")?.setValue(element.descripcion);
    }

    editForm(){
        const req = {
            titulo: this.nivelForm.value.titulo,
            descripcion: this.nivelForm.value.descripcion,
        }
        this.supabase.updateNiveles(this.dataToEdit.id, req).subscribe(data => {
            if(data == null){
                this.limpiarForm();
                this.toastService.showToast('success', 'Nivel ' + req.titulo + ' editado correctamente!');
                this.getListNiveles();
            }
            console.log(data);
        },error => {
            this.toastService.showToast('danger', error);
        });
    }

    deleteNivel(id: any){
        this.supabase.deleteNiveles(id).subscribe(data => {
            if(data == null){
                this.limpiarForm();
                this.toastService.showToast('success', 'Nivel eliminado correctamente!');
                this.getListNiveles();
            }
            console.log(data);
        },error => {
            this.toastService.showToast('danger', error);
        });
    }
}
