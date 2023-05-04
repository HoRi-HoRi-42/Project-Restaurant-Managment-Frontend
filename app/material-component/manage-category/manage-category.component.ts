import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { CategoryComponent } from '../dialog/category/category.component';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {

  displayedColumns: string[] = ['name', 'edit'];
  dataSource: any;
  responseMessage: any;


  constructor(
    private categoryService: CategoryService,
    private ngxService: NgxUiLoaderService,
    private snackBarService: SnackbarService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    this.categoryService.getCategorys().subscribe((response: any) => {
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
    }
      , (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericErrorMessage;
        }
        this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();//dialogConfig is a variable of type MatDialogConfig which is imported from angular material dialog module 
    dialogConfig.data = {
      action: 'Add'//dialogConfig.data is an object which is used to pass data to the dialog component
    };
    dialogConfig.width = '850px';
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);//
    this.router.events.subscribe(() => {//this.router.events.subscribe is used to close the dialog box when the route changes 
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddCategory.subscribe((response) => {
      this.tableData();//this.tableData() is used to refresh the table data after adding a new category
    });
  }

  handleEditAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values
    };
    dialogConfig.width = '850px';
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddCategory.subscribe((response) => {
      this.tableData();
    });
  }
}
