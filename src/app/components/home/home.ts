import { Component } from '@angular/core';
import { ListLanguage, VocabularyList } from '../../models/vocabulary.model';
import { Router } from '@angular/router';
import { VocabularyService } from '../../services/vocabulary';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  //lists: VocabularyList[] = [];
  lists$: Observable<VocabularyList[]>; // Observable that updates in real time

  listForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    language: new FormControl('', Validators.required),
  });

  constructor(private vocabularyService: VocabularyService, private router: Router) {
    this.lists$ = this.vocabularyService.getLists();
   }

  async createList() {
    const name = this.listForm.get('name')?.value?.trim();
    const description = this.listForm.get('description')?.value?.trim();
    const language = this.listForm.get('language')?.value as ListLanguage;
    
    if (!name || !language) return;

    try {
      const newList = await this.vocabularyService.createList(name, language, description);
      this.listForm.reset(); // this.listForm.get('name')?.setValue('');
      this.viewList(newList.id);
    } catch (error) {
      console.error('Error creating list:' + error);
      // TODO add toast
    }

  }

  viewList(id: string) {
    this.router.navigate(['/list', id]);
  }

  async deleteList(id: string) {
    if (confirm('Are you sure you want to delete this list? This action cannot be undone.')) {
      try {
        await this.vocabularyService.deleteList(id);
      } catch (error) {
        console.error('Error deleting list:' + error);
        alert('Failed to delete list.');
      }
    }

  }
}
