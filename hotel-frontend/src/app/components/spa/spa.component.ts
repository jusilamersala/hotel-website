import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-spa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './spa.component.html',
  styleUrls: ['./spa.component.css']
})
export class SpaComponent {
  selectedService: 'therapy' | 'pool' | 'gym' = 'therapy';

  spaServices = [
    { id: 'therapy', title: 'Terapi & Masazhe', description: 'Relieve stress and rejuvenate your body with our professional massages and wellness therapies.', icon: 'bi-hand-thumbs-up' },
    { id: 'pool', title: 'Pishina & Sauna', description: 'Enjoy our heated pools and sauna facilities for complete relaxation and health benefits.', icon: 'bi-water' },
    { id: 'gym', title: 'Gym & Fitness', description: 'State-of-the-art gym with modern equipment and personal trainers to keep you fit.', icon: 'bi-dumbbell' },
  ];

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      const service = params['service'];
      if (service === 'therapy' || service === 'pool' || service === 'gym') {
        this.selectedService = service;
      }
    });
  }
}