import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/Auth/auth.service';
import { SupabaseService } from '../../services/Supabase/supabase.service';
import { ToastService } from '../../services/toasteMessage/toast.service';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-asistencia',
    imports: [RouterLink, ReactiveFormsModule, NgClass],
    templateUrl: './asistencia.component.html',
    styleUrl: './asistencia.component.css'
})
export class AsistenciaComponent implements OnInit{
  session: any;
  dataClases: any[] = [];
  dataMarc: any[] = [];
  formMarc!: FormGroup;
  objDateEntrada: any = {};
  objDateSalida: any = {};
  constructor(
    private supabase: SupabaseService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private authService: AuthService,
  ){
    this.formMarc = this.fb.group({
      clase: [null, Validators.required],
    });
  }
  ngOnInit() {
    this.assignSelect();
    this.onChangeSelect();
  }

  onChangeSelect(){
    this.formMarc.get('clase')?.valueChanges.subscribe((value) => {
      if(value != ""){
        this.supabase.getMarcaciones(this.session.data.session.user.id, value, this.obtFechaString()).subscribe(data => {
          this.dataMarc = data;
          this.assignDateTime();
          //console.log(data);
        });
      }
    });
  }
  assignDateTime(){
    if(this.dataMarc.length > 0){
      const res = this.dataMarc.filter(data => data.tipo_marcacion == "entrada")
      if(res.length > 0) this.objDateEntrada = this.obtenerHoraYFecha(new Date(res[0].fecha_marcacion));

      const res1 = this.dataMarc.filter(data => data.tipo_marcacion == "salida")
      if(res1.length > 0) this.objDateSalida = this.obtenerHoraYFecha(new Date(res1[0].fecha_marcacion));
    }
  }
  getMarcaciones(){
    this.supabase.getMarcaciones(this.session.data.session.user.id, this.formMarc.value.clase, this.obtFechaString()).subscribe(data => {
      this.dataMarc = data;
      this.assignDateTime();
      //console.log(data);
    });
  }
  validShowMarc(){
    //console.log(this.formMarc.value.clase)
    if(this.formMarc.value.clase != "" && this.formMarc.value.clase != null) return true;
    else return false;
  }
  registrarMarcacion(val: any){
    const fec = new Date();
    const req = {
      user_id: this.session.data.session.user.id,
      clase_id: this.formMarc.value.clase,
      fecha_marcacion: fec.toISOString(), // Formato ISO: YYYY-MM-DDTHH:mm:ssZ
      tipo_marcacion: val
    }
    //console.log(req);
    this.supabase.postMarcacion(req).subscribe(data => {
      //console.log(data);
      this.getMarcaciones();
    })
  }

  obtFechaString(): string {
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Mes comienza en 0
    const dia = fecha.getDate().toString().padStart(2, '0');
  
    return `${anio}-${mes}-${dia}`;
  }
  async assignSelect(){
    this.session = await this.authService.session();
    if(this.session){
      const id_user = this.session.data.session.user.id;
      this.supabase.getGradosPorUsuario(id_user).subscribe(data => {
        this.dataClases = data;
        //console.log(data);
      });
    }
  }

  obtenerFechaActual(): string {
    const diasSemana: string[] = [
      "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
    ];
    const meses: string[] = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
  
    const fecha = new Date();
    const diaSemana = diasSemana[fecha.getDay()];
    const diaMes = fecha.getDate();
    const mes = meses[fecha.getMonth()];
  
    return `${diaSemana} ${diaMes} de ${mes}`;
  }

  obtenerHoraYFecha(date: Date): { hora: string; fecha: string } {
    const opcionesFecha: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    const opcionesHora: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };

    return {
      fecha: date.toLocaleDateString('es-ES', opcionesFecha),
      hora: date.toLocaleTimeString('es-ES', opcionesHora),
    };
  }
  existReg(val: string){
    if(this.dataMarc.length > 0){
      const res = this.dataMarc.filter(data => data.tipo_marcacion == val)
      if(res.length > 0) return true;
      else return false;
    }else{
      return false;
    }
  }
}
