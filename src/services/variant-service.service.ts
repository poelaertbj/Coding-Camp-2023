import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DataPoint} from "../models/data-point";
import * as d3 from "d3";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VariantServiceService {
  data: BehaviorSubject<DataPoint[]>= new BehaviorSubject<DataPoint[]>([]);
  series: BehaviorSubject<any>= new BehaviorSubject<any>([]);
  keys: string[]=[];

  constructor(private http: HttpClient) { }
  fetchUrlData(){
    this.http.get('https://data.cdc.gov/resource/jr58-6ysp.json').subscribe((res: any) =>{
      const data =this.parseData(res)
      console.log(data)
      this.parseSeries(data)
    })


  }
  fetchFileData(){
      this.http.get('/assets/data.csv', {responseType: 'text'}).subscribe(res => {
        this.parseSeries(this.parseData(d3.csvParse(res)))
      })

  }


parseData(res:any) {
    const d= this.cleanData(res)
  const tempData: DataPoint[] = d.map(d => new DataPoint(d))
    .sort((a, b) => a.share - b.share)
    .sort((a, b) => a.week_ending - b.week_ending)
  this.keys = [...new Set(tempData.map(p => p.variant))]
  this.data.next(tempData)
  return tempData
}

parseSeries(data:DataPoint[]){
    console.log(data)
  // console.log(this.data)
  const series = d3.stack()
    .keys(this.keys)
    //@ts-ignore
    .value((group: any, key: any) => {
      if (group.has(key)){
        return group.get(key).share
      } else {
        return 0
      }
    })
    .order(d3.stackOrderReverse)
    //@ts-ignore
    (d3.rollup(data, ([d]) => d, d => d.displayWeek, d => d.variant).values())
    //@ts-ignore
    .map(s =>  (s.forEach(d => {
      //@ts-ignore
      d.data = d.data.get(s.key)
      return d.data
    }), s))
  this.series.next(series)
}
cleanData(data): any[]{
    const variantMap: Map <string, any>= new Map<string, any>()
    console.log(data)
    let ret= [];
    const filtered= data.filter(d=> d.usa_or_hhsregion==='USA' && d.time_interval==='biweekly').sort((a,b)=> a.published_date.localeCompare(b.published_date));
    console.log(filtered)
  filtered.forEach(p=> {
    if(variantMap.has(p.variant)){
      let points=variantMap.get(p.variant)
      if(points){
       // if(points.has(p.week_ending)){
          points.set(p.week_ending,p)
      //  }
      }else{
        console.log("ldkjfa;")
      }
    }else{
      const tempMap=new Map()
      tempMap.set(p.week_ending,p)
      variantMap.set(p.variant, tempMap)
    }
  })
  console.log(variantMap)
  const t= [...variantMap.values()]
t.forEach(m =>{
  ret.push(...m.values())
  })
  console.log(ret)

    return ret;


}
}
