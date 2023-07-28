import {Component, Input, ViewChild} from '@angular/core';
import {DataPoint} from "../../models/data-point";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-circulating-variants',
  templateUrl: './circulating-variants.component.html',
  styleUrls: ['./circulating-variants.component.scss']
})
export class CirculatingVariantsComponent {
@Input() weekData!: DataPoint[]
displayColumns= ["variant", "share"]
  dataSource = new MatTableDataSource<DataPoint>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngAfterViewInit() {
    console.log(this.weekData)

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(change){
    console.log(change)
    this.dataSource.data= this.weekData;
  }

  ngOnInit(){
  console.log(this)
  }
}
