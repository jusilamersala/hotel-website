import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ServicesService } from '../../services/services.service'; // Importo shërbimin

@Component({
  selector: 'app-spa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './spa.component.html',
  styleUrls: ['./spa.component.css']
})
export class SpaComponent implements OnInit {
  // Array bosh që do mbushet nga DB
  spaServices: any[] = [];
  
  // Shërbimi që është zgjedhur aktualisht (për ta shfaqur me detaje)
  selectedService: any = null;

  constructor(
    private route: ActivatedRoute,
    private servicesService: ServicesService
  ) {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.servicesService.getServices().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.spaServices = response.data;
          
          // Pasi ngarkohen shërbimet, kontrollojmë URL-në për ID-në
          this.checkQueryParams();
        }
      },
      error: (err) => console.error('Gabim:', err)
    });
  }

  checkQueryParams() {
    this.route.queryParams.subscribe(params => {
      const serviceId = params['id']; // Tani kërkojmë për ?id=...
      
      if (serviceId) {
        // Gjejmë shërbimin në array-in tonë që ka këtë ID
        this.selectedService = this.spaServices.find(s => s.service_ID == serviceId);
      } else if (this.spaServices.length > 0) {
        // Nëse nuk ka ID në URL, zgjidh të parin si default
        this.selectedService = this.spaServices[0];
      }
    });
  }

  // Metodë për të ndërruar shërbimin manualisht (nëse ke butona në faqe)
  selectService(service: any) {
    this.selectedService = service;
  }
}