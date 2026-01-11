import { Component, OnInit } from '@angular/core';
import { VocabularyService } from '../../services/vocabulary';
import { ActivatedRoute, Router } from '@angular/router';
import { ListLanguage, VocabularyList } from '../../models/vocabulary.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-list-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './list-edit.html',
  styleUrl: './list-edit.css',
})
export class ListEdit implements OnInit {
  list$: Observable<VocabularyList | null>;
  listId: string | null = null;

  listForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    language: new FormControl<ListLanguage | null>(null, Validators.required),
  });

  constructor(
    private vocabularyService: VocabularyService, 
    private router: Router, 
    private route: ActivatedRoute
  ) {
    this.list$ = new Observable();
  }

  ngOnInit() {
    this.listId = this.route.snapshot.paramMap.get('id');
    if (!this.listId) {
      this.router.navigate(['/']);
      return;
    }

    this.list$ = this.vocabularyService.getListById(this.listId).pipe(
      tap(list => { // fills the form (like subscribe method)
        if (list) {
          this.listForm.patchValue({ // updates only the provided fields
            name: list.name,
            description: list.description || '',
            language: list.language
          });
        }
      })
    );
  }

  async saveList() {
    if (this.listForm.invalid || !this.listId) return;

    const updates = {
      name: this.listForm.get('name')?.value?.trim(),
      description: this.listForm.get('description')?.value?.trim() || '',
      language: this.listForm.get('language')?.value as ListLanguage
    };

    try {
      await this.vocabularyService.updateList(this.listId, updates);
      this.viewList(this.listId);
    } catch (error) {
      console.error('Error updating list:' + error);
      alert('Failed to save changes.');
      // TODO add toast
    }
  }
  
  viewList(id: string) {
    this.router.navigate(['/list', id]);
  }

  goBackToLists() {
    this.router.navigate(['/']);
  }
}
