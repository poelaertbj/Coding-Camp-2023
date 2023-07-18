import { HttpClient } from '@angular/common/http';

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

//import {swatches} from "@d3/color-legend"
import * as d3 from 'd3';

class DataPoint {
  modeltype?: string;
  nchs_or_count_flag?: string;
published_date?: string;
share?: number;
share_hi?: number;
share_lo?: number;
time_interval?: string;
usa_or_hhsregion?: string;
variant?: string;
 week_ending?: number;
 displayWeek?: string;

 constructor (obj: any) {
   this.share = +obj.share;
   this.variant = obj.variant;
   this.week_ending = Date.parse(<string>obj.week_ending)
   this.displayWeek = obj.week_ending.split(' ')[0]
 }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  @ViewChild('cureLine', {read: ElementRef}) chartContainer!: ElementRef;
  colors: Map<string, string> = new Map<string, string>([
    ["A.2.5", "#2A5784"],
    ["AY.1", "#43719F"],
    ["AY.2", "#5B8DB8"],
    ["AY.3", "#7AAAD0"],
    ["B.1", "#9BC7E4"],
    ["B.1.1", "#BADDF1"],
    ["B.1.1.194", "#E1575A"],
    ["B.1.1.519", "#EE7423"],
    ["B.1.1.529", "#F59D3D"],
    ["B.1.1.7", "#FFC686"],
    ["B.1.2", "#9D7760"],
    ["B.1.234", "#F1CF63"],
    ["B.1.243", "#7C4D79"],
    ["B.1.351", "#9B6A97"],
    ["B.1.427", "#BE89AC"],
    ["B.1.429", "#D5A5C4"],
    ["B.1.525", "#EFC9E6"],
    ["B.1.526", "#BBB1AC"],
    ["B.1.526.1", "#24693D"],
    ["B.1.526.2", "#398949"],
    ["B.1.596", "#61AA57"],
    ["B.1.617", "#7DC470"],
    ["B.1.617.1", "#B4E0A7"],
    ["B.1.617.2", "#2A5784"],
    ["B.1.617.3", "#43719F"],
    ["B.1.621", "#5B8DB8"],
    ["B.1.621.1", "#7AAAD0"],
    ["B.1.626", "#9BC7E4"],
    ["B.1.628", "#BADDF1"],
    ["B.1.637", "#E1575A"],
    ["BA.1.1", "#EE7423"],
    ["BA.2", "#F59D3D"],
    ["BA.2.12.1", "#FFC686"],
    ["BA.2.75", "#9D7760"],
    ["BA.2.75.2", "#F1CF63"],
    ["BA.4", "#7C4D79"],
    ["BA.4.6", "#9B6A97"],
    ["BA.5", "#BE89AC"],
    ["BA.5.2.6", "#D5A5C4"],
    ["BF.11", "#EFC9E6"],
    ["BF.7", "#BBB1AC"],
    ["BN.1", "#24693D"],
    ["BQ.1", "#398949"],
    ["BQ.1.1", "#61AA57"],
    ["CH.1.1", "#7DC470"],
    ["FD.2", "#B4E0A7"],
    ["Other", "#2A5784"],
    ["P.1", "#43719F"],
    ["P.2", "#5B8DB8"],
    ["R.1", "#7AAAD0"],
    ["XBB", "#9BC7E4"],
    ["XBB.1.16", "#BADDF1"],
    ["XBB.1.5", "#E1575A"],
    ["XBB.1.5.1", "#EE7423"],
    ["XBB.1.5.10", "#F59D3D"],
    ["XBB.1.9.1", "#FFC686"],
    ["XBB.1.9.2", "#9D7760"],
    ["XBB.2.3", "#F1CF63"]
  ])


  height = 500

  margin = ({top: 20, right: 30, bottom: 30, left: 30})
  width = 1000

  svg: any;
  data: DataPoint[];
  series: any;
  xAxis: any;
  yAxis: any;


  constructor(

    private http: HttpClient
  ){}
  ngOnInit(){
    console.log(this)

   // this.http.get('/assets/data.csv', {responseType: 'text'}).subscribe(res =>{
     //this.data =d3.csvParse(res).map(d => new DataPoint(d))
    this.http.get(' https://data.cdc.gov/resource/jr58-6ysp.json').subscribe((res: any) =>{
      this.data = res.map(d => new DataPoint(d))
      console.log(this.data)
      this.series = d3.stack()
        .keys(this.colors.keys())
        //@ts-ignore
        .value((group: any, key: any) => {
          if (group.has(key)){
            return group.get(key).share
          } else {
            return new DataPoint({})
          }
        })
        .order(d3.stackOrderReverse)
        //@ts-ignore
        (d3.rollup(this.data, ([d]) => d, d => d.week_ending, d => d.variant).values())
        //@ts-ignore
        .map(s =>  (s.forEach(d => {
          //@ts-ignore
          console.log(d.data.get(s.key));
          //@ts-ignore
          d.data = d.data.get(s.key)
          if(!d.data) {
            console.log(d)
          }
          return d.data
        }), s))

      console.log(this.series);

      this.xAxis = g => g
        .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
        .call(d3.axisBottom(x)
          //@ts-ignore
          .tickValues(d3.ticks(...d3.extent(x.domain()), this.width / 80))
          //@ts-ignore
          .tickSizeOuter(0))

      this.yAxis = g => g
        .attr("transform", `translate(${this.margin.left},0)`)
        .call(d3.axisLeft(y)
          //@ts-ignore
          .tickFormat(x => (x / 1e9).toFixed(0)))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
          .attr("x", 3)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text("Share"))
console.log ([... new Set (this.data.map(d => d.week_ending))])
      const x = d3.scaleBand()
        //@ts-ignore
        .domain([... new Set (this.data.map(d => d.week_ending))])
        //.rangeRound([0,1000])
        .range([this.margin.left, this.width - this.margin.right])

      const y = d3.scaleLinear()
        //@ts-ignore
        .domain([0, d3.max(this.series, d => d3.max(d, d => d[1]))]).nice()
        .range([this.height - this.margin.bottom, this.margin.top])

      const color = d3.scaleOrdinal()
        .domain(this.colors.keys())
        .range(this.colors.values())

      this.svg = this.chartContainer.nativeElement;
      d3.select(this.svg).selectAll('svg').remove();
      this.svg = d3.select(this.svg)
        .append("svg")
        //@ts-ignore
        .attr("viewBox", [0, 0, this.width, this.height]);


      this.svg.append("g")
        .selectAll("g")
        .data(this.series)
        .join("g")
        .attr("fill", ({key}) => color(key))
        .call(g => g.selectAll("rect")
          .data(d => d.filter(d => d.data))
          .join("rect")
          .attr("x", (d) => {
            return x(d.data.week_ending)})
          .attr("y", d => y(d[1]))
          .attr("width", x.bandwidth() - 1)
          .attr("height", d => y(d[0]) - y(d[1]))
          .append("title")
          .text(d =>  `Variant: ${d.data.variant}, Share: ${d.data.share*100}%`));


      this.svg.append("g")
        .call(this.xAxis);

      this.svg.append("g")
        .call(this.yAxis);

      return this.svg.node();
    })
  }

}

