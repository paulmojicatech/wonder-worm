import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, signal, type OnInit } from '@angular/core';
import { take } from 'rxjs';
import { NgLoaderComponent } from '../ng-loader/ng-loader.component';


@Component({
  selector: 'pmt-comprehension-details',
  standalone: true,
  imports: [NgLoaderComponent, HttpClientModule], 
  providers: [{provide: Document, useValue: document}],
  template: `
    @if (!storyS()) {
      <pmt-loader></pmt-loader>
    } @else {
      <div>
        <span class="font-2rem">Story</span>
        <p>{{storyS()}}</p>
        <span class="font-2rem">Questions</span>
        @for(question of questionAndAnswersS(); track question.question) {
          <h2>{{question.question}}</h2>
          <ul>
            @for(possibleAnswer of question.possibleAnswers; track possibleAnswer.answer) {
              <li>
                <input (click)="handleQuestionAnswerClick(question.question, possibleAnswer.answer)" type="radio" name="{{question.question}}" value="{{possibleAnswer.answer}}">
                <label>{{possibleAnswer.answer}}</label>
                @if (showAnswerS()?.question === question.question && showAnswerS()?.answer === possibleAnswer.answer) {
                  @if (possibleAnswer.isCorrect) {
                    <span class="ml-1rem correct">Correct</span>
                  } @else {
                    <span class="ml-1rem wrong">Try Again!</span>
                  }                  
                }           
              </li>
            }
          </ul>
        }
      </div>
    }
  `,
  styles: `
    li {
      list-style-type: none;
    }
    .correct {      
      color: green;
    }
    .wrong {
      color: red;
    }
  `
})
export class ComprehensionDetailsComponent implements OnInit {
  
  private _httpClient = inject(HttpClient);
  private _document = inject(Document);

  readonly STORY_URL = 'https://dqgxskajzvgovshtegzl4z4zbu0ggzkj.lambda-url.us-east-1.on.aws/comprehension/story';

  storyS = signal<string | undefined>(undefined);
  questionAndAnswersS = signal<{question: string, possibleAnswers: {answer: string, isCorrect: boolean}[]}[]>([]);
  showAnswerS = signal<{question: string, answer: string} | undefined>(undefined);


  ngOnInit(): void {
    const userCookie = this._document.cookie.split(';').find(cookie => cookie.trim().startsWith('user='));
    const token = userCookie ? userCookie.split('token%22%3A%22')[1].split('%22')[0] : undefined;
    if (token) {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', 
        'Accept': 'application/json', 
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Credentials': 'true', 
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      };
      this._httpClient.get<{story: string, questionsAndAnswers: {question: string, possibleAnswers: {answer: string, isCorrect: boolean}[]}[]}>(this.STORY_URL, {headers})
      .pipe(take(1))
      .subscribe(response => {
        this.storyS.set(response.story);
        const updatedQuestionsAndAnswers = response.questionsAndAnswers.map(questionAndAnswer => {
          return {
            question: questionAndAnswer.question,
            possibleAnswers: this.shuffleAnswers(questionAndAnswer.possibleAnswers)
          };
        });
        this.questionAndAnswersS.set(updatedQuestionsAndAnswers);
      });
    }
  }

  handleQuestionAnswerClick(question: string, answer: string): void {
    console.log(question, answer);
    this.showAnswerS.set({question, answer});
  }

  private shuffleAnswers(answers: {answer: string, isCorrect: boolean}[]): {answer: string, isCorrect: boolean}[] {
    return answers.sort(() => Math.random() - 0.5);
  }

}