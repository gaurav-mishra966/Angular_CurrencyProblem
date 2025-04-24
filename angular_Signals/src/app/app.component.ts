import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CurrencyServiceService } from '../services/currency-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular_Signals';

  inputAmount = signal(1);
  fromCurrency = signal<'USD' | 'EUR' | 'CAD' | 'GBP' | 'INR'>('USD');
  toCurrency = signal<'USD' | 'EUR' | 'CAD' | 'GBP' | 'INR'>('GBP');

  readonly currencyService = inject(CurrencyServiceService);
  CurrencySymbol: any;
  currencies: any;

  constructor() {}

  readonly computedAmount = computed(() => {
    const amount = this.inputAmount();
    const from = this.fromCurrency();
    const to = this.toCurrency();
    return this.currencyService.convertAmount(amount, from, to);
  });
}
