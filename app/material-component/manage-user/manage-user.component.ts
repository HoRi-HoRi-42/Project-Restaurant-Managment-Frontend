import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'status', 'logged'];
  dataSource: any;
  responseMessage: any;


  constructor(private ngxService: NgxUiLoaderService,
    private userService: UserService,
    private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    this.userService.getUsers().subscribe((response: any) => {
      this.ngxService.stop();
      console.log(response);
      this.dataSource = new MatTableDataSource(response);
    }, (error: any) => {
      this.ngxService.stop();
      console.log(error.error?.message);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = "Something went wrong";
      }
      this.snackbarService.openSnackBar(this.responseMessage, 'error');
    }
    );
  }

  applyFilter(event: Event) {
    const FilterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = FilterValue.trim().toLowerCase();
  }

  onChange(values: any, id: any) {
    this.ngxService.start();
    var data = {
      status: status.toString(),
      id: id
    }

    this.userService.update(data).subscribe((response: any) => {
      this.ngxService.stop();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, 'success');
    }, (error: any) => {
      this.ngxService.stop();
      console.log(error.error?.message);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = "Something went wrong";
      }
      this.snackbarService.openSnackBar(this.responseMessage, 'error');
    }
    );
  }
}
