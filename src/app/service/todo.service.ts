import { Injectable } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor( private afs: AngularFirestore, private toastr: ToastrService) { }

  saveTodo( id: string, data: { [x: string]: any; todo?: any; isCompleted?: boolean; } ) {

    this.afs.collection('categories').doc(id).collection('todos').add(data).then(ref =>{

      this.afs.doc('categories/' + id).update({todoCount: firebase.firestore.FieldValue.increment(1)});

      this.toastr.success('New Todo Saved Succesfully');
  });

  }

  loadTodos( id: string ) {
    return this.afs.collection('categories').doc(id).collection('todos').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => { 
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, data}
        })
      })
    )
  }

  updateTodo( catId: string, todoId: string, updatedData: any ) {
    this.afs.collection('categories').doc(catId).collection('todos').doc(todoId).update({todo: updatedData }).then(() => {

      this.toastr.success('Todo Updated Successfully');

    })
  }

  deleteTodo(catId: string, todoId: string) {
    this.afs.collection('categories').doc(catId).collection('todos').doc(todoId).delete().then(() => {
      this.afs.doc('categories/' + catId).update({todoCount: firebase.firestore.FieldValue.increment(-1)});
      this.toastr.error('Todo deleted Successfully');

  })
}

markComplete(catId: string, todoId: string) {

  this.afs.collection('categories').doc(catId).collection('todos').doc(todoId).update({isCompleted: true }).then(() => {

    this.toastr.info('Todo Mark Completed');

  })

}

markUncomplete(catId: string, todoId: string) {

  this.afs.collection('categories').doc(catId).collection('todos').doc(todoId).update({isCompleted: false }).then(() => {

    this.toastr.warning('Todo Mark Uncompleted');

  })

}

}
