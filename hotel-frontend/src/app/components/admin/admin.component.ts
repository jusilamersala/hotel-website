import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RoomService } from '../../services/room.services';
import { StaffService } from '../../services/staff.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  rooms: any[] = [];
  staff: any[] = [];
  invoices: any[] = [];
  activeTab: string = 'rooms';

  constructor(
    private http: HttpClient,
    private roomService: RoomService,
    private staffService: StaffService
  ) {}

  ngOnInit(): void {
    this.loadRooms();
    this.loadStaff();
    this.loadAllInvoices();
  }

  // --- NAVIGIMI ---
  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'invoices') {
      this.loadAllInvoices();
    }
  }

  // --- NGARKIMI I TË DHËNAVE ---
  loadRooms() {
    this.roomService.getRooms().subscribe((data: any) => {
      if (data.status === 'success') this.rooms = data.data;
    });
  }

  loadStaff() {
    this.staffService.getStaff().subscribe((data: any) => {
      if (data.status === 'success') this.staff = data.data;
    });
  }

  loadAllInvoices() {
    this.http.get('http://localhost:8000/api/admin/getInvoices.php').subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.invoices = res.data;
        }
      },
      error: (err) => console.error("Gabim në ngarkimin e faturave:", err)
    });
  }

  // --- MENAXHIMI I FATURAVE ---

  getTotalInvoiced(): number {
    return this.invoices.reduce((acc, inv) => acc + parseFloat(inv.price || 0), 0);
  }

  // Funksioni për të ndryshuar statusin (p.sh. nga Pending në Confirmed)
  updateInvoiceStatus(invoiceId: number, newStatus: string) {
    this.http.post('http://localhost:8000/api/admin/updateInvoiceStatus.php', {
      invoice_id: invoiceId,
      status: newStatus
    }).subscribe({
      next: (res: any) => {
        alert("Statusi u përditësua me sukses!");
        this.loadAllInvoices(); // Rifresko tabelën
      },
      error: (err) => alert("Gabim gjatë përditësimit.")
    });
  }

  // GJENERIMI I PDF (Ndryshimi i ri - Nuk ka nevojë për skedar PHP)
  downloadInvoicePDF(invoice: any) {
    const doc = new jsPDF();
    
    // Header-i i Hotelit
    doc.setFontSize(22);
    doc.setTextColor(197, 160, 89); // Ngjyra Gold e Grand Horizon
    doc.text('GRAND HORIZON - HOTEL LUXURY', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Dashboard Administrativ - Faturë Zyrtare', 105, 28, { align: 'center' });
    
    doc.setDrawColor(200);
    doc.line(20, 35, 190, 35);

    // Detajet e Faturës
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text(`ID E FATURËS: #INV-${invoice.invoice_ID}`, 20, 45);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Klienti: ${invoice.user_name} ${invoice.user_surname}`, 20, 55);
    doc.text(`Dhoma: ${invoice.room_name}`, 20, 65);
    doc.text(`Data e Rezervimit: ${invoice.check_In_Date}`, 20, 75);
    doc.text(`Statusi: ${invoice.status}`, 20, 85);

    // Tabela e Kostove
    autoTable(doc, {
      startY: 95,
      head: [['Përshkrimi', 'Çmimi']],
      body: [
        [`Akomodimi në ${invoice.room_name}`, `${invoice.price}€`],
        [{ content: 'TOTALI PËR TË PAGUAR', styles: { fontStyle: 'bold' } }, { content: `${invoice.price}€`, styles: { fontStyle: 'bold' } }]
      ],
      theme: 'grid',
      headStyles: { fillColor: [197, 160, 89] },
      styles: { fontSize: 11 }
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text('Kjo faturë është gjeneruar automatikisht nga sistemi Grand Horizon.', 105, finalY, { align: 'center' });

    // Shkarkimi
    doc.save(`Fatura_Admin_${invoice.invoice_ID}.pdf`);
  }

  // --- CRUD ROOMS ---
  addRoom() { /* Logjika jote */ }
  editRoom(room: any) { /* Logjika jote */ }
  deleteRoom(id: number) {
    if (confirm("Fshij dhomën?")) {
      this.roomService.deleteRoom(id).subscribe(() => this.loadRooms());
    }
  }

  // --- CRUD STAFF ---
  deleteStaff(id: number) {
    if (confirm("Hiq stafin?")) {
      this.staffService.deleteStaff(id).subscribe(() => this.loadStaff());
    }
  }
}