// Описаний в документації
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';
// Для відображення повідомлень користувачеві, замість window.alert()
import { Report } from 'notiflix/build/notiflix-report-aio';

const TIMER_DELAY = 1000;
let intervalId = null;
let selectedDate = null;
let currentDate = null;

const refs = {
  dateInput: document.querySelector('input#datetime-picker'),
  btnStartTimer: document.querySelector('button[data-start]'),
  btnPauseTimer: document.querySelector('button[data-pause]'),
  btnResetTimer: document.querySelector('button[data-reset]'),
  timer: document.querySelector('.timer'),
  daysRemaining: document.querySelector('[data-days]'),
  hoursRemaining: document.querySelector('[data-hours]'),
  minutesRemaining: document.querySelector('[data-minutes]'),
  secondsRemaining: document.querySelector('[data-seconds]'),
};

refs.btnStartTimer.disabled = true;
refs.btnPauseTimer.disabled = false;
refs.btnResetTimer.disabled = false;
refs.btnStartTimer.addEventListener('click', timerStart);
refs.btnPauseTimer.addEventListener('click', timerPause);
refs.btnResetTimer.addEventListener('click', timerReset);

let userTime = 0;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0].getTime() < Date.now()) {
      Report.failure('Failure', 'Please choose a date in the future', 'Ok');
    } else {
      selectedDate = selectedDates[0].getTime();
      refs.btnStartTimer.disabled = false;
      console.log(selectedDates[0]);
    }
  },
};

flatpickr(refs.dateInput, options);

Report.info('Hello!', 'Please, choose a date in the future', 'Ok');

function timerStart() {
  intervalId = setInterval(() => {
    currentDate = new Date().getTime();
    if (selectedDate <= currentDate) {
      clearInterval(intervalId);
      refs.btnStartTimer.disabled = true;
      refs.dateInput.disabled = false;
      return;
    } else {
      refs.btnStartTimer.disabled = true;
      refs.dateInput.disabled = true;
      userTime = Math.floor(selectedDate - currentDate);
      convertMs(userTime);
    }
  }, TIMER_DELAY);
}

refs.btnStartTimer.addEventListener('click', () => {
  refs.dateInput.setAttribute('readonly', true);
});

refs.btnResetTimer.addEventListener('click', () => {
  refs.dateInput.removeAttribute('readonly');
});

function timerPause() {
  refs.btnStartTimer.disabled = false;
  clearInterval(intervalId);
}

function timerReset() {
  clearInterval(intervalId);
  userTime = 0;
  refs.timer = userTime;
  selectedDate = userTime;
  convertMs(userTime);
  refs.dateInput.disabled = false;  
}

function createMarkup({ days, hours, minutes, seconds }) {
  refs.daysRemaining.textContent = days;
  refs.hoursRemaining.textContent = hours;
  refs.minutesRemaining.textContent = minutes;
  refs.secondsRemaining.textContent = seconds;
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = addLeadingZero(Math.floor(ms / day));
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );
  createMarkup({ days, hours, minutes, seconds });
  return { days, hours, minutes, seconds };
}
