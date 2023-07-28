import { HttpClient } from '@angular/common/http';

import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

//import {swatches} from "@d3/color-legend"
import * as d3 from 'd3';
import {DataPoint} from "../models/data-point";
import {VariantServiceService} from "../services/variant-service.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
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
  colors2 =[
    "#000080",
    "#0000cd",
    "#0000ff",
    "#006400",
    "#00ff00",
    "#00ff7f",
    "#00ffff",
    "#191970",
    "#20b2aa",
    "#2e8b57",
    "#2f4f4f",
    "#32cd32",
    "#4682b4",
    "#556b2f",
    "#6495ed",
    "#663399",
    "#778899",
    "#808000",
    "#87cefa",
    "#8b0000",
    "#8b008b",
    "#7fffd4",
    "#8fbc8f",
    "#9370db",
    "#98fb98",
    "#9932cc",
    "#9acd32",
    "#a020f0",
    "#a0522d",
    "#adff2f",
    "#afeeee",
    "#b03060",
    "#b8860b",
    "#bc8f8f",
    "#c71585",
    "#cd5c5c",
    "#d2691e",
    "#d2b48c",
    "#d3d3d3",
    "#da70d6",
    "#db7093",
    "#dc143c",
    "#dda0dd",
    "#e9967a",
    "#eee8aa",
    "#f4a460",
    "#ff00ff",
    "#ff4500",
    "#ff6347",
    "#ff69b4",
    "#ff8c00",
    "#ffb6c1",
    "#ffd700",
    "#ffff00",]

  height = 500

  margin = ({top: 20, right: 30, bottom: 300, left: 30})
  width = 1000

  svg: any;
  data: DataPoint[];
  series: any;
  xAxis: any;
  yAxis: any;
  keys: any;
  weekData: DataPoint[];



  constructor(
private variantService: VariantServiceService,
    private http: HttpClient
  ){
   //this.variantService.fetchUrlData()
    this.variantService.fetchFileData()

  }
  ngAfterViewInit() {
    console.log(this)
    this.variantService.data.subscribe(res => {
      this.keys= [...new Set(res.map(p=>p.variant))]
      this.data = res
    })

    this.variantService.series.subscribe(res =>{
      this.series = res
      this.drawChart()
    })
    console.log(this)

    console.log(this.series);
  }
drawChart(){
      this.xAxis = g => g
        .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
        .call(d3.axisBottom(x)
          //@ts-ignore
          .tickValues(x.domain().filter(function(d,i){ return !(i%2)})))
        //.tickValues(x.domain()))
          //@ts-ignore
         // .tickSizeOuter(0))

      this.yAxis = g => g
        .attr("transform", `translate(${this.margin.left},0)`)
        .call(d3.axisLeft(y)
          //@ts-ignore
          .tickFormat(x => (x *100).toFixed(0)))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
          .attr("x", 3)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text("Share%"))
      const x = d3.scaleBand()
        //@ts-ignore
        .domain(this.data.map(d => d.displayWeek))
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
        .attr("fill", ({key}) => this.colors2[this.keys.indexOf(key)])//color(key))
        .call(g => g.selectAll("rect")
          .data(d => d.filter(d => d.data))
          .join("rect")
          .attr("x", (d) => {
            return x(d.data.displayWeek)})
          .attr("y", d => y(d[1]))
          .attr("width", x.bandwidth() - 1)
          .attr("height", d => y(d[0]) - y(d[1]))
          .append("title")
          .text(d =>  `Variant: ${d.data.variant}, Share: ${d.data.share*100}%`))
      //.on("click", this.clicked);

this.svg.selectAll("rect") .on("click", (event,d)=>this.clicked(event, d));

      this.svg.append("g")
        .call(this.xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

      this.svg.append("g")
        .call(this.yAxis);

      return this.svg.node();
    //})
  }
clicked(event, d){
console.log(event)
  console.log(d)
  console.log(this)
  this.getWeekData(d.data)
}
getWeekData(data: DataPoint){
    const week= data.displayWeek
  this.weekData =this.data.filter(p=>p.displayWeek===week)


}

}

