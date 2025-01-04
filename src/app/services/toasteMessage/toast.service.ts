import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  type: 'success' | 'danger' | 'warning';
  message: string;
}

@Injectable({
  providedIn: 'root'
})

export class ToastService {
  private toastSubject = new Subject<Toast>();
  toast$ = this.toastSubject.asObservable();

  showToast(type: 'success' | 'danger' | 'warning', message: string) {
    this.toastSubject.next({ type, message });
  }
}
