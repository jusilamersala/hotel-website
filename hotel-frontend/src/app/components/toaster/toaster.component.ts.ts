import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toasts" [class]="'toast ' + toast.type">
        <span class="icon">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
        <span style="margin-left: 5px"  class="message">{{ toast.message }}</span>
      </div>
    </div>
  `,
  styleUrls: ['./toaster.component.css']
})
export class ToasterComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toastState$.subscribe((toast) => {
      this.toasts.push(toast);
      
      // Zhduket automatikisht pas 4 sekondash
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t !== toast);
      }, 4000);
    });
  }
}