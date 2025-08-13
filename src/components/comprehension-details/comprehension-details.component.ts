import { Component, inject, signal, type OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { NgLoaderComponent } from '../ng-loader/ng-loader.component';


@Component({
  selector: 'pmt-comprehension-details',
  standalone: true,
  imports: [NgLoaderComponent],
  template: `
    @if (!storyS()) {
      <pmt-loader></pmt-loader>
    } @else {
      <div class="comprehension-container">
        <div class="story-section">
          <h2 class="section-title">📖 Story</h2>
          <div class="story-content">{{storyS()}}</div>
        </div>

        <div class="questions-section">
          <h2 class="section-title">❓ Questions</h2>
          @for(question of questionAndAnswersS(); track question.question; let i = $index) {
            <div class="question-card">
              <h3 class="question-text">{{i + 1}}. {{question.question}}</h3>
              <div class="answers-grid">
                @for(possibleAnswer of question.possibleAnswers; track possibleAnswer.answer; let j = $index) {
                  <div class="answer-option"
                       [class.selected]="showAnswerS()?.question === question.question && showAnswerS()?.answer === possibleAnswer.answer"
                       [class.correct]="showAnswerS()?.question === question.question && showAnswerS()?.answer === possibleAnswer.answer && possibleAnswer.isCorrect"
                       [class.incorrect]="showAnswerS()?.question === question.question && showAnswerS()?.answer === possibleAnswer.answer && !possibleAnswer.isCorrect">
                    <input
                      (click)="handleQuestionAnswerClick(question.question, possibleAnswer.answer)"
                      type="radio"
                      name="question_{{i}}"
                      value="{{possibleAnswer.answer}}"
                      class="answer-radio"
                      id="q{{i}}_a{{j}}">
                    <label for="q{{i}}_a{{j}}" class="answer-label">
                      <span class="option-letter">{{getOptionLetter(j)}}</span>
                      <span class="answer-text">{{possibleAnswer.answer}}</span>
                      @if (showAnswerS()?.question === question.question && showAnswerS()?.answer === possibleAnswer.answer) {
                        @if (possibleAnswer.isCorrect) {
                          <span class="feedback correct-feedback">✓ Correct!</span>
                        } @else {
                          <span class="feedback incorrect-feedback">✗ Try Again!</span>
                        }
                      }
                    </label>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: `
    .comprehension-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .story-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 32px;
      color: white;
      box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);
    }

    .questions-section {
      margin-top: 32px;
    }

    .section-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 16px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .story-content {
      font-size: 16px;
      line-height: 1.6;
      background: rgba(255, 255, 255, 0.1);
      padding: 20px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
    }

    .question-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .question-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    }

    .question-text {
      font-size: 18px;
      font-weight: 600;
      color: #2d3748;
      margin: 0 0 20px 0;
      line-height: 1.4;
    }

    .answers-grid {
      display: grid;
      gap: 12px;
    }

    .answer-option {
      position: relative;
      transition: all 0.2s ease;
    }

    .answer-radio {
      position: absolute;
      opacity: 0;
      cursor: pointer;
    }

    .answer-label {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 15px;
      color: #4a5568;
    }

    .answer-label:hover {
      background: #edf2f7;
      border-color: #cbd5e0;
      transform: translateX(4px);
    }

    .option-letter {
      background: #667eea;
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      flex-shrink: 0;
    }

    .answer-text {
      flex: 1;
      line-height: 1.4;
    }

    .feedback {
      font-weight: 600;
      font-size: 14px;
      padding: 4px 12px;
      border-radius: 20px;
      animation: fadeInScale 0.3s ease-out;
    }

    .correct-feedback {
      background: #c6f6d5;
      color: #2f855a;
    }

    .incorrect-feedback {
      background: #fed7d7;
      color: #c53030;
    }

    .answer-option.selected .answer-label {
      border-color: #667eea;
      background: #edf2f7;
    }

    .answer-option.correct .answer-label {
      border-color: #48bb78;
      background: #f0fff4;
    }

    .answer-option.correct .option-letter {
      background: #48bb78;
    }

    .answer-option.incorrect .answer-label {
      border-color: #f56565;
      background: #fffafa;
    }

    .answer-option.incorrect .option-letter {
      background: #f56565;
    }

    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @media (max-width: 768px) {
      .comprehension-container {
        padding: 16px;
      }

      .story-section,
      .question-card {
        padding: 20px;
      }

      .section-title {
        font-size: 20px;
      }

      .question-text {
        font-size: 16px;
      }
    }
  `
})
export class ComprehensionDetailsComponent implements OnInit {

  private _document = inject(DOCUMENT);
  private _platformId = inject(PLATFORM_ID);

  readonly STORY_URL = 'https://dqgxskajzvgovshtegzl4z4zbu0ggzkj.lambda-url.us-east-1.on.aws/comprehension/story';

  storyS = signal<string | undefined>(undefined);
  questionAndAnswersS = signal<{question: string, possibleAnswers: {answer: string, isCorrect: boolean}[]}[]>([]);
  showAnswerS = signal<{question: string, answer: string} | undefined>(undefined);


  async ngOnInit() {
    if (!isPlatformBrowser(this._platformId)) {
      return; // Don't try to access cookies during SSR
    }

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

      const httpResp = await fetch(this.STORY_URL, { headers }).catch(error => {
          console.error('Error fetching story:', error);
          return Promise.reject(error);
        });
      const response: {story: string, questionsAndAnswers: {question: string, possibleAnswers: {answer: string, isCorrect: boolean}[]}[]} = await httpResp.json();
        this.storyS.set(response.story);
        const updatedQuestionsAndAnswers = response.questionsAndAnswers.map(questionAndAnswer => {
          return {
            question: questionAndAnswer.question,
            possibleAnswers: this.shuffleAnswers(questionAndAnswer.possibleAnswers)
          };
        });
        this.questionAndAnswersS.set(updatedQuestionsAndAnswers);
    }
  }

  handleQuestionAnswerClick(question: string, answer: string): void {
    console.log(question, answer);
    this.showAnswerS.set({question, answer});
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C, D...
  }

  private shuffleAnswers(answers: {answer: string, isCorrect: boolean}[]): {answer: string, isCorrect: boolean}[] {
    return answers.sort(() => Math.random() - 0.5);
  }

}