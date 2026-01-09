import { Component, HostListener, OnInit } from '@angular/core';
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
  list$: Observable<VocabularyList | null>;
  listId: string | null = null;
  showMenuId: string | null = null;

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

  addNewItem() {
    if (this.listId) {
      this.router.navigate(['/list', this.listId, 'add']);
    }
  }

  startQuiz() {
    if (this.listId) {
      this.router.navigate(['/list', this.listId, 'quiz']);
    }
  }

  async onVocabFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    let items: NewVocabularyItem[];
    try {
      items = JSON.parse(text);
    } catch {
      alert('Invalid JSON.');
      return;
    }

    if (!this.listId) return;

    for (const item of items) {
      if (item.vocab && item.translation && item.category) {
        await this.vocabularyService.addItemToList(this.listId, item);
      }
    }

    // TODO add txt
  }

  toggleMenu(id: string) {
    this.showMenuId = this.showMenuId === id ? null : id;
  }

  editItem(id: string) {

  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as Element;

    if (!target.closest('.menu-btn')) {
      this.showMenuId = null;
    }
  }
}
