import { Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'country-select',
  styles: ['body'],
  templateUrl: './country-select.component.html'
})

export class CountrySelectComponent  {
    @Input() country:string;
    @Input() required:boolean = false;    
    @Output() countryChange:EventEmitter<String> = new EventEmitter<String>();

    constructor() {
    }

    onChange(select){
      this.country = select.value; 
      this.countryChange.next(this.country); 
    }
}
