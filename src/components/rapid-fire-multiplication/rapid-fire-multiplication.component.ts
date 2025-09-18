import { isPlatformBrowser } from '@angular/common';
import type { OnDestroy, OnInit } from '@angular/core';
import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { interval, take } from 'rxjs';

@Component({
  selector: 'pmt-rapid-fire-multiplication',
  standalone: true,
  imports: [],
  template: `
    <div class="flex flex-col items-center gap-4">
      <!-- CSS Styles -->
      <style>
        @keyframes shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
          100% { transform: translateX(0); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        .checkmark-anim {
          animation: checkmark-pop 0.6s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes checkmark-pop {
          0% { opacity: 0; transform: scale(0.5); }
          40% { opacity: 1; transform: scale(1.2); }
          70% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.8); }
        }
      </style>

      <!-- Pre-game state -->
      @if (!startedS()) {
        <div class="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 border border-gray-100 dark:border-neutral-800 transition-all duration-300">
          <span class="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">Ready...</span>
          <span class="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">Set...</span>
          <button
            (click)="startGame()"
            class="bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
            Go!
          </button>
        </div>
      }

      <!-- Game over state -->
      @if (timeLeftS() === 0) {
        <div class="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 border border-gray-100 dark:border-neutral-800 transition-all duration-300 text-center">
          <div class="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-2">Time's up!</div>
          <div class="text-xl mb-4">Your score: <span class="font-extrabold text-indigo-600 dark:text-indigo-200 animate-bounce">{{scoreS()}}</span></div>
          <button
            (click)="startGame()"
            class="bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
            Play Again
          </button>
        </div>
      }

      <!-- Active game state -->
      @if (startedS() && timeLeftS() > 0) {
        <div class="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 border border-gray-100 dark:border-neutral-800 transition-all duration-300">
          <!-- Score and Timer -->
          <div class="flex items-center justify-between w-full mb-2">
            <div class="text-lg font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-neutral-800 px-4 py-2 rounded-lg shadow-sm transition-all duration-200">
              Score: <span class="animate-bounce inline-block">{{scoreS()}}</span>
            </div>
            <div class="text-3xl font-extrabold tracking-widest px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-400 via-indigo-600 to-indigo-400 text-white shadow-md animate-pulse">
              {{timeLeftS()}}s
            </div>
          </div>

          <!-- Problem Display -->
          <div class="relative w-full flex flex-col items-center">
            <div class="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-4 drop-shadow-lg">
              {{problemS().a}} × {{problemS().b}} = ?
            </div>
            @if (showCheckS()) {
              <span class="absolute top-0 right-0 checkmark-anim text-green-500 text-4xl select-none">
                ✓
              </span>
            }
          </div>

          <!-- Answer Form -->
          <form (ngSubmit)="handleAnswer($event)" class="flex gap-3 w-full justify-center mb-2">
            <input
              #answerInput
              type="tel"
              [value]="answerS()"
              (input)="onInputChange($event)"
              [class]="getInputClass()"
              autofocus
            />
            <button
              (click)="handleAnswer($event)"
              class="bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
              Submit
            </button>
          </form>
        </div>
      }
    </div>
  `
})
export class RapidFireMultiplicationComponent implements OnDestroy {

  private _platformId = inject(PLATFORM_ID);
  private _timerId: any = null;

  startedS = signal(false);
  scoreS = signal(0);
  timeLeftS = signal(60);
  problemS = signal(this.generateProblem());
  answerS = signal('');
  shakeS = signal(false);
  showCheckS = signal(false);


  ngOnDestroy(): void {
    if (this._timerId) {
      clearInterval(this._timerId);
    }
  }

  startGame(): void {
    this.startedS.set(true);
    this.scoreS.set(0);
    this.timeLeftS.set(60);
    this.problemS.set(this.generateProblem());
    this.answerS.set('');
    this.shakeS.set(false);
    this.showCheckS.set(false);

    // Start the timer
    if (isPlatformBrowser(this._platformId)) {
      this._timerId = setInterval(() => {
        const currentTime = this.timeLeftS();
        if (currentTime > 0) {
          this.timeLeftS.set(currentTime - 1);
        } else {
          this.stopGame();
        }
      }, 1000);
    }
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.answerS.set(target.value);
  }

  handleAnswer(event: Event): void {
    event.preventDefault();
    const userAnswer = +this.answerS();
    const correctAnswer = this.problemS().a * this.problemS().b;

    if (userAnswer === correctAnswer) {
      // Correct answer
      this.scoreS.set(this.scoreS() + 1);
      this.showCheckS.set(true);

      interval(600).pipe(take(1)).subscribe(() => {
        this.showCheckS.set(false);
      });

      this.shakeS.set(false);
      this.problemS.set(this.generateProblem());
      this.answerS.set('');
    } else {
      // Wrong answer
      this.shakeS.set(true);
      interval(400).pipe(take(1)).subscribe(() => {
        this.shakeS.set(false);
      });
    }
  }

  getInputClass(): string {
    const baseClass = 'border-2 border-indigo-300 dark:border-indigo-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-2xl w-28 text-center bg-gray-50 dark:bg-neutral-800 text-gray-800 dark:text-gray-100 transition-all duration-200';
    const shakeClass = this.shakeS() ? 'animate-shake border-red-500' : '';
    return `${baseClass} ${shakeClass}`;
  }

  private stopGame(): void {
    if (this._timerId) {
      clearInterval(this._timerId);
      this._timerId = null;
    }
  }

  private generateProblem(): { a: number; b: number } {

    // Default rapid-fire mode with 2-digit numbers
    const a = Math.floor(Math.random() * 12) + 1;
    const b = Math.floor(Math.random() * 12) + 1;
    return { a, b };

  }
}