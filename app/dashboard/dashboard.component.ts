import { Component, AfterViewInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { DashboardService } from '../services/dashboard.service';
import { GlobalConstants } from '../shared/global-constants';
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

	responseMessage: any;
	data: any;

	ngAfterViewInit() { }

	constructor(private dashBoardService: DashboardService,
		private ngxService: NgxUiLoaderService,
		private snackBarService: SnackbarService) {
		this.ngxService.start();
		this.dashboardData();
	}


	dashboardData() {
		this.dashBoardService.getDetails().subscribe((response: any) => {
			console.log(response); // add this line
			this.ngxService.stop();
			this.data = response;
			console.log(this.data);
		}, (error:any) => {        
			this.ngxService.stop();
			console.log(error);
			if (error.error?.message) {
				this.responseMessage = error.error?.message;
			} else {
				this.responseMessage = GlobalConstants.genericErrorMessage;
			}
			this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error);
		});
	}
	

}