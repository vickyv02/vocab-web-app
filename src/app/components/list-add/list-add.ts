import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, take } from 'rxjs';
import { ListLanguage, NewVocabularyItem, VocabularyCategory, VocabularyItem, VocabularyList } from '../../models/vocabulary.model';
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
  pinyinPossible = false;

  vocabs: VocabularyItem[] = [];
  addVocabForm = new FormGroup({
    vocab: new FormControl('', Validators.required),
    pronunciation: new FormControl(''),
    translation: new FormControl('', Validators.required),
    example: new FormControl(''),
    category: new FormControl(VocabularyCategory.Other, Validators.required)
  });

  constructor(private vocabularyService: VocabularyService, 
    private route: ActivatedRoute, 
    private router: Router) {
    this.list$ = new Observable();
  };

  ngOnInit() {
    this.listId = this.route.snapshot.paramMap.get('id');
    if (this.listId) {
      this.list$ = this.vocabularyService.getListById(this.listId);
      this.list$.pipe(take(1)).subscribe(async list => {
        if (!list) return;
        if (list.sourceLanguage == ListLanguage.Chinese) this.pinyinPossible = true;
      });
    } else {
      this.router.navigate(['/']);
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

  async autoTranslate() {
    const vocab = this.addVocabForm.get('vocab')?.value?.trim();
    if (!vocab) return;

    this.list$.pipe(take(1)).subscribe(async list => {
      if (!list) return;

      try {
        const translation = await this.vocabularyService.autoTranslate(
          vocab,
          list.sourceLanguage,
          list.targetLanguage || 'en'
        );
        this.addVocabForm.patchValue({ translation });
      } catch {
        alert('Auto-translation failed. Please try again or enter manually.');
      }
    });
  }

  async autoPinyin() {
    const vocab = this.addVocabForm.get('vocab')?.value?.trim();
    if (!vocab) return;

    try {
      const pinyin = await this.vocabularyService.autoPinyin(vocab);
      this.addVocabForm.patchValue({ pronunciation: pinyin });
    } catch {
      alert('Auto-creation of pinyin failed. Please try again or enter manually.');
    }
  }
}
