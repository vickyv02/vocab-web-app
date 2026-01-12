import { Component, OnInit } from '@angular/core';
import { VocabularyService } from '../../services/vocabulary';
import { ActivatedRoute, Router } from '@angular/router';
import { ListLanguage, VocabularyCategory, VocabularyItem, VocabularyList } from '../../models/vocabulary.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, take, tap } from 'rxjs';

@Component({
  selector: 'app-vocab-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vocab-edit.html',
  styleUrl: './vocab-edit.css',
})
export class VocabEdit implements OnInit {
  list$: Observable<VocabularyList | null>;
  vocabItem$: Observable<VocabularyItem | null>;
  listId: string | null = null;
  vocabItemId: string | null = null;
  pinyinPossible = false;

  vocabForm = new FormGroup({
    vocab: new FormControl('', Validators.required),
    pronunciation: new FormControl(''),
    translation: new FormControl('', Validators.required),
    example: new FormControl(''),
    category: new FormControl(VocabularyCategory.Other, Validators.required)
  });

  constructor(
    private vocabularyService: VocabularyService, 
    private router: Router, 
    private route: ActivatedRoute
  ) {
    this.list$ = new Observable();
    this.vocabItem$ = new Observable();
  }

  ngOnInit() {
    this.listId = this.route.snapshot.paramMap.get('id');
    if (!this.listId) {
      this.router.navigate(['/']);
      return;
    }

    this.vocabItemId = this.route.snapshot.paramMap.get('itemId');
    if (!this.vocabItemId) {
      this.router.navigate(['/lists', this.listId]);
      return;
    }

    this.list$ = this.vocabularyService.getListById(this.listId);
    this.list$.pipe(take(1)).subscribe(async list => {
      if (!list) return;
      if (list.sourceLanguage == ListLanguage.Chinese) this.pinyinPossible = true;
    });

    this.vocabItem$ = this.vocabularyService.getVocabItemById(this.listId, this.vocabItemId).pipe(
      tap(vocabItem => { // fills the form (like subscribe method)
        if (vocabItem) {
          this.vocabForm.patchValue({ // updates only the provided fields
            vocab: vocabItem.vocab,
            pronunciation: vocabItem.pronunciation || '',
            translation: vocabItem.translation,
            example: vocabItem.example || '',
            category: vocabItem.category
          });
        }
      })
    );
  }

  async saveVocab() {
    if (this.vocabForm.invalid || !this.listId || !this.vocabItemId) return;

    const updates = {
      vocab: this.vocabForm.get('vocab')?.value?.trim(),
      pronunciation: this.vocabForm.get('pronunciation')?.value?.trim() || '',
      translation: this.vocabForm.get('translation')?.value?.trim(),
      example: this.vocabForm.get('example')?.value?.trim() || '',
      category: this.vocabForm.get('category')?.value as VocabularyCategory
    };

    try {
      await this.vocabularyService.updateListItem(this.listId, this.vocabItemId, updates);
      this.viewList();
    } catch (error) {
      console.error('Error updating list:' + error);
      alert('Failed to save changes.');
      // TODO add toast
    }
  }
  
  viewList() {
    this.router.navigate(['/list', this.listId]);
  }

  async autoTranslate() {
    const vocab = this.vocabForm.get('vocab')?.value?.trim();
    if (!vocab) return;

    this.list$.pipe(take(1)).subscribe(async list => {
      if (!list) return;

      try {
        const translation = await this.vocabularyService.autoTranslate(
          vocab,
          list.sourceLanguage,
          list.targetLanguage || 'en'
        );
        this.vocabForm.patchValue({ translation });
      } catch {
        alert('Auto-translation failed. Please try again or enter manually.');
      }
    });
  }

  async autoPinyin() {
    const vocab = this.vocabForm.get('vocab')?.value?.trim();
    if (!vocab) return;

    try {
      const pinyin = await this.vocabularyService.autoPinyin(vocab);
      this.vocabForm.patchValue({ pronunciation: pinyin });
    } catch {
      alert('Auto-creation of pinyin failed. Please try again or enter manually.');
    }
  }
}
