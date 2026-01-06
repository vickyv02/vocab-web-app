import { Component, OnInit } from '@angular/core';
import { VocabularyItem } from '../../models/vocabulary.model';
import { ActivatedRoute, Router } from '@angular/router';
import { VocabularyService } from '../../services/vocabulary';
import { map, take } from 'rxjs';
import { CommonModule } from '@angular/common';

interface QuizQuestion {
  prompt: string;
  options: string[];
  correctAnswer: string;
  vocabAsPrompt: boolean;
  item: VocabularyItem
}

@Component({
  selector: 'app-quiz',
  imports: [CommonModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz implements OnInit {
  listId: string | null = null;
  questions: QuizQuestion[] = [];
  currentQuestionIndex = 0;
  score = 0;
  quizComplete = false;
  selectedAnswer: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private vocabularyService: VocabularyService) {}

  ngOnInit(): void {
    this.listId = this.route.snapshot.paramMap.get('id');
    if (this.listId) {
      this.vocabularyService.getListById(this.listId).pipe(
        take(1),
        map(list => list?.items || [])
      ).subscribe(items => {
        this.generateQuiz(items);
      });
    } else {
      this.router.navigate(['/']);
    }
  }

  private generateQuiz(items: VocabularyItem[]): void {
    console.log(items.length);
    if (items.length < 4) {
      alert('At least 4 words are needed to create a quiz from this list.');
      this.router.navigate(['list', this.listId]);
      return;
    }

    const selectedItems = ([...items].sort(() => 0.5 - Math.random())).slice(0, Math.min(10, items.length)); // shuffle items, then take the first 10

    this.questions = selectedItems.map(item => {
      const vocabAsPrompt = Math.random() > 0.5; // randomly show vocab or translation
      const prompt = vocabAsPrompt ? item.vocab : item.translation;
      const correctAnswer = vocabAsPrompt ? item.translation : item.vocab;

      // 3 wrong answers
      const sameCategoryItems = items.filter(i => i.category === item.category && i.id !== item.id);
      //const otherCategoryItems = items.filter(i => i.id !== item.id && !sameCategoryItems.includes(i));
      console.log("quizzing " + item.category);

      //const wrongAnswers: string[] = [];
      //const usedIds = new Set<string>();

      /*const addWrongAnswer = (candidateItem: VocabularyItem) => {
        if (usedIds.has(candidateItem.id)) return;
        const answer = vocabAsPrompt ? candidateItem.translation : candidateItem.vocab;
        if (answer !== correctAnswer) {
          wrongAnswers.push(answer);
          usedIds.add(candidateItem.id);
        }
      }

      [...sameCategoryItems].sort(() => 0.5 - Math.random()).forEach(addWrongAnswer);
      if (wrongAnswers.length < 3) {
        [...otherCategoryItems].sort(() => 0.5 - Math.random()).forEach(addWrongAnswer);
        while (wrongAnswers.length > 3) wrongAnswers.pop();
      }*/

      const wrongAnswers = sameCategoryItems.sort(() => 0.5 - Math.random()).slice(0, 3)
        .map(a => vocabAsPrompt ? a.translation : a.vocab);

      if (wrongAnswers.length < 3) {
        const fallback = items.filter(i => i.id !== item.id).sort(() => 0.5 - Math.random())
          .slice(0, 3 - wrongAnswers.length)
          .map(a => vocabAsPrompt ? a.translation : a.vocab);
        wrongAnswers.push(...fallback);
      }

      const options = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());
      
      return { prompt, options, correctAnswer, vocabAsPrompt, item };
    });

    console.log('Quiz generated successfully:', this.questions);
  }

  selectAnswer(answer: string): void {
    if (this.selectedAnswer) return;

    this.selectedAnswer = answer;
    if (answer === this.questions[this.currentQuestionIndex].correctAnswer) {
      this.score++;
    }
  }

  nextQuestion(): void {
    this.selectedAnswer = null;
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex >= this.questions.length) {
      this.quizComplete = true;
    }
  }

  restartQuiz(): void {
    this.router.navigate(['/list', this.listId, 'quiz']);
  }

  backToList(): void {
    this.router.navigate(['/list', this.listId]);
  }
}
