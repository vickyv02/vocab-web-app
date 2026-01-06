import { Component, OnInit } from '@angular/core';
import { NewVocabularyItem, VocabularyCategory, VocabularyItem, VocabularyList } from '../../models/vocabulary.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VocabularyService } from '../../services/vocabulary';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-detail',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './list-detail.html',
  styleUrl: './list-detail.css',
})
export class ListDetail implements OnInit {
  //list?: VocabularyList;
  list$: Observable<VocabularyList | null>;
  listId: string | null = null;

  vocabs: VocabularyItem[] = [];
  addVocabForm = new FormGroup({
    vocab: new FormControl('', Validators.required),
    translation: new FormControl('', Validators.required),
    example: new FormControl(''),
    category: new FormControl(VocabularyCategory.Other, Validators.required)
  });

  constructor(private vocabularyService: VocabularyService, private route: ActivatedRoute, private router: Router) {
    this.list$ = new Observable();
  };

  ngOnInit() {
    this.listId = this.route.snapshot.paramMap.get('id');
    if (this.listId) {
      this.list$ = this.vocabularyService.getListById(this.listId);
    } else {
      this.router.navigate(['/']); // to home
    }
  }

  async addVocab() {
    if (!this.listId) return;

    const vocab = this.addVocabForm.get('vocab')?.value?.trim();
    const translation = this.addVocabForm.get('translation')?.value?.trim();
    const category = this.addVocabForm.get('category')?.value as VocabularyCategory;

    if (!vocab || !translation || !category) return;

    const newVocab: NewVocabularyItem = {
      vocab: vocab,
      translation: translation,
      example: this.addVocabForm.get('example')?.value?.trim() || undefined,
      category: category
    }

    try {
      await this.vocabularyService.addItemToList(this.listId, newVocab);
      this.addVocabForm.reset({ category: VocabularyCategory.Other });
    } catch (error) {
      console.error('Error adding vocab:', error);
      // TODO add toast
    }
  }

  goBackToLists() {
    this.router.navigate(['/']);
  }

  async deleteItem(itemId: string) {
    if (!this.listId) return;

    if (confirm('Delete this item?')) {
      try {
        await this.vocabularyService.deleteItemFromList(this.listId, itemId);
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item.');
      }
    }
  }

  startQuiz() {
    if (this.listId) {
      this.router.navigate(['/list', this.listId, 'quiz']);
    }
  }
}
