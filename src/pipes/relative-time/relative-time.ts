import { Pipe, PipeTransform } from '@angular/core';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

/**
 * Generated class for the RelativeTimePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'relativeTime',
})
export class RelativeTime implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    return distanceInWordsToNow(new Date(value), {addSuffix: true});
    //return value.toLowerCase();
  }
}
