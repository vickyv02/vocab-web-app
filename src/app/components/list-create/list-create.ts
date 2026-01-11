import { Component } from '@angular/core';
import { VocabularyService } from '../../services/vocabulary';
import { Router } from '@angular/router';
import { ListLanguage } from '../../models/vocabulary.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './list-create.html',
  styleUrl: './list-create.css',
})
export class ListCreate {
  listForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    language: new FormControl<ListLanguage | null>(null, Validators.required),
  });

  constructor(private vocabularyService: VocabularyService, private router: Router) { }

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

  goBackToLists() {
    this.router.navigate(['/']);
  }
}
