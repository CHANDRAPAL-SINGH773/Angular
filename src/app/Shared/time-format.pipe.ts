import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

  transform(value: string): string {
    console.log(value,"value");
    
    const parts = value.split(':');
    const hours = parseInt(parts[0]);
    // const minutes = parts[1];
    const minutes = parts[1]; 
    // Convert hours to 12-hour format
    const formattedHours = hours % 12 || 12;
    const period = hours >= 12 ? 'PM' : 'AM';

    // Add leading zero for single-digit hours
    const formattedHoursString = formattedHours < 10 ? '0' + formattedHours : formattedHours.toString();
    console.log(formattedHoursString + ':' + minutes + ' ' + period,"<<<<<<<<<<<<<<value>>>>>>>>>>>>>>");
    return formattedHoursString + ':' + minutes + ' ' + period;
  }
}
