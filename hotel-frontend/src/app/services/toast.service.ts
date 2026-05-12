import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  // Përdorim Subject për të transmetuar mesazhin te komponenti i Toaster-it
  private toastSubject = new Subject<Toast>();
  toastState$ = this.toastSubject.asObservable();

  showSuccess(message: string) {
    this.toastSubject.next({ message, type: 'success' });
  }

  showError(message: string) {
    this.toastSubject.next({ message, type: 'error' });
  }
}