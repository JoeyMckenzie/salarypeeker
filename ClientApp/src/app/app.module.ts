// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ChartModule } from "angular2-chartjs";
import { DisqusModule } from "angular2-disqus";

// Components
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { SalaryDataComponent } from './salary-data/salary-data.component';

// Services
import { SalaryDataService, PagingService } from "./services";

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    SalaryDataComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ChartModule,
    DisqusModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'salary-data', component: SalaryDataComponent },
    ])
  ],
  providers: [SalaryDataService, PagingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
