import {HttpClientModule} from "@angular/common/http";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CirculatingVariantsComponent } from './circulating-variants/circulating-variants.component';

@NgModule({
  declarations: [
    AppComponent,
    CirculatingVariantsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
