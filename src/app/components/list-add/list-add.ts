import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { NewVocabularyItem, VocabularyCategory, VocabularyItem, VocabularyList } from '../../models/vocabulary.model';
import { VocabularyService } from '../../services/vocabulary';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-list-add',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './list-add.html',
  styleUrl: './list-add.css',
})
export class ListAdd {
  list$: Observable<VocabularyList | null>;
  listId: string | null = null;

  vocabs: VocabularyItem[] = [];
  addVocabForm = new FormGroup({
    vocab: new FormControl('', Validators.required),
    pronunciation: new FormControl(''),
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
      pronunciation: this.addVocabForm.get('pronunciation')?.value?.trim() || undefined,
      translation: translation,
      example: this.addVocabForm.get('example')?.value?.trim() || undefined,
      category: category
    }

    try {
      await this.vocabularyService.addItemToList(this.listId, newVocab);
      this.addVocabForm.reset({ category: VocabularyCategory.Other });
      console.log('Added.');
    } catch (error) {
      console.error('Error adding vocab:', error);
      // TODO add toast
    }
  }

  goBackToList() {
    this.router.navigate(['/list', this.listId]);
  }
}
