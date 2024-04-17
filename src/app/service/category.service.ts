import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor( private afs: AngularFirestore, private toastr: ToastrService) { }

  saveCategory(data: unknown) {
    this.afs.collection('categories').add(data).then(ref =>{
      this.toastr.success('New Category Saved Succesfully');
    })
  }

  loadCategories() {
    return this.afs.collection('categories').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => { 
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, data}
        })
      })
    )
  }

  updateCategory (id:string, updatedData: { category: string }) {
    this.afs.doc('categories/' + id).update({category: updatedData}).then( () => {
      this.toastr.success('Updated Successfully');
      
    })
  }

  
deleteCategory (id: string) {
  this.afs.doc('categories/' + id).delete().then( () => {
    this.toastr.error('Category deleted Successfully');
  })
}

}


