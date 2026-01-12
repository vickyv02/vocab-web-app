import { Component, HostListener } from '@angular/core';
import { VocabularyList } from '../../models/vocabulary.model';
import { Router } from '@angular/router';
import { VocabularyService } from '../../services/vocabulary';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  lists$: Observable<VocabularyList[]>; // Observable that updates in real time
  showMenuId: string | null = null;

  constructor(private vocabularyService: VocabularyService, private router: Router) {
    this.lists$ = this.vocabularyService.getLists();
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

  createList() {
    this.router.navigate(['/list/create']);
  }

  toggleMenu(id: string) {
    this.showMenuId = this.showMenuId === id ? null : id;
  }

  editList(id: string) {
    this.router.navigate(['/list', id, 'edit']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as Element;

    if (!target.closest('.menu-btn')) {
      this.showMenuId = null;
    }
  }

  goToProfile() {
    this.router.navigate(['/user']);
  }
}
