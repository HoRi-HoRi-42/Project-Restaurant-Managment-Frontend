import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { CategoryService } from 'src/app/services/category.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  productForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Add";
  responseMessage: any;
  categorys: any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductComponent>,
    private categoryService: CategoryService,
    private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      description: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      categoryId: [null, [Validators.required]],
      price: [null, [Validators.required]],
    });

    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Update";
      this.productForm.patchValue(this.dialogData.data);
    }
    this.getCategorys();
  }

  getCategorys() {
    this.categoryService.getCategorys().subscribe((response: any) => {
      this.categorys = response;
    }, (error: any) => {
      console.error(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = "Something went wrong";
      }
      this.snackbarService.openSnackBar(this.responseMessage, "error");
    })
  }

  handleSubmit() {
    if (this.dialogAction === "Edit") {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    var formData = this.productForm.value;
    var data = {
      name: formData.name,
      description: formData.description,
      categoryId: formData.categoryId,
      price: formData.price
    }

    this.productService.add(data).subscribe((response: any) => {
      this.dialogRef.close();//close the dialog
      this.onAddProduct.emit(response);//refresh the table
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error: any) => {
      console.error(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = "Something went wrong";
      }
      this.snackbarService.openSnackBar(this.responseMessage, "error");
    })
  }

  edit() {
    var formData = this.productForm.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description
    }

    this.productService.update(data).subscribe((response: any) => {
      this.dialogRef.close();//close the dialog
      this.onEditProduct.emit(response);//refresh the table
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error: any) => {
      console.error(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = "Something went wrong";
      }
      this.snackbarService.openSnackBar(this.responseMessage, "error");
    })
  }
}
