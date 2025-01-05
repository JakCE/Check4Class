import { NgClass, NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Toast, ToastService } from '../../../services/toasteMessage/toast.service';

@Component({
    selector: 'app-toast',
    imports: [NgSwitchCase, NgClass, NgSwitch, NgFor],
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit{
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toast$.subscribe((toast) => {
      this.toasts.push(toast);
      setTimeout(() => this.removeToast(toast), 3000); // Desaparece en 3 segundos
    });
  }

  removeToast(toast: Toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  getStyles(type: 'success' | 'danger' | 'warning') {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200';
      case 'danger':
        return 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200';
      case 'warning':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-200';
      default:
        return '';
    }
  }
  
  getIconBackground(type: 'success' | 'danger' | 'warning') {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-green-100';
      case 'danger':
        return 'bg-red-500 text-red-100';
      case 'warning':
        return 'bg-orange-500 text-orange-100';
      default:
        return '';
    }
  }
}
