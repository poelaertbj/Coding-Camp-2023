export class DataPoint {
  modeltype?: string;
  nchs_or_count_flag?: string;
  published_date?: string;
  share=0;
  share_hi?: number;
  share_lo?: number;
  time_interval?: string;
  usa_or_hhsregion?: string;
  variant?: string;
  week_ending=0;
  displayWeek?: string;

  constructor (obj: any) {
    this.share = +obj.share;
    this.variant = obj.variant;
    this.week_ending = Date.parse(<string>obj.week_ending)
    this.displayWeek = obj.week_ending.split('T')[0].trim()
  }
}
