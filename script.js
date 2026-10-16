const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const sessionCount = document.getElementById('session-count');
const clearCompleted = document.getElementById('clear-completed');

let tasks = [];
let completedSessions = 0;

function renderTasks() {
  taskList.innerHTML = '';
  if (tasks.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = 'Your task list is ready. Add your first task above ✨';
    taskList.appendChild(empty);
  } else {
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      if (task.done) li.classList.add('done');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;
      checkbox.setAttribute('aria-label', `Mark ${task.text} complete`);
      checkbox.addEventListener('change', () => {
        tasks[index].done = checkbox.checked;
        renderTasks();
      });
      const label = document.createElement('span');
      label.className = 'task-text';
      label.textContent = task.text;
      const remove = document.createElement('button');
      remove.className = 'delete-task';
      remove.type = 'button';
      remove.textContent = '×';
      remove.setAttribute('aria-label', `Delete ${task.text}`);
      remove.addEventListener('click', () => {
        tasks.splice(index, 1);
        renderTasks();
      });
      li.append(checkbox, label, remove);
      taskList.appendChild(li);
    });
  }
  taskCount.textContent = String(tasks.filter(task => task.done).length).padStart(2, '0');
}

taskForm.addEventListener('submit', event => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ text, done: false });
  taskInput.value = '';
  renderTasks();
  taskInput.focus();
});

clearCompleted.addEventListener('click', () => {
  tasks = tasks.filter(task => !task.done);
  renderTasks();
});

let selectedMinutes = 25;
let remainingSeconds = selectedMinutes * 60;
let interval = null;
let running = false;
const timerDisplay = document.getElementById('timer-display');
const timerStatus = document.getElementById('timer-status');
const timerRing = document.querySelector('.timer-ring');
const startButton = document.getElementById('timer-start');
const resetButton = document.getElementById('timer-reset');
const presets = document.querySelectorAll('.preset');

function paintTimer() {
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const total = selectedMinutes * 60;
  const progress = total ? (total - remainingSeconds) / total : 0;
  timerRing.style.background = `conic-gradient(#7768e8 ${progress * 360}deg, #dedaff 0deg)`;
}

function stopTimer() {
  if (interval) clearInterval(interval);
  interval = null;
  running = false;
  startButton.textContent = '▶ Start focus';
}

function startTimer() {
  if (running) {
    stopTimer();
    timerStatus.textContent = 'PAUSED';
    return;
  }
  running = true;
  startButton.textContent = 'Ⅱ Pause';
  timerStatus.textContent = 'YOU ARE FOCUSED';
  interval = setInterval(() => {
    remainingSeconds--;
    paintTimer();
    if (remainingSeconds <= 0) {
      stopTimer();
      timerStatus.textContent = 'SESSION COMPLETE!';
      completedSessions++;
      sessionCount.textContent = String(completedSessions).padStart(2, '0');
      startButton.textContent = '▶ Start again';
      alert('Great work, Shivam! Your focus session is complete. Take a short break.');
    }
  }, 1000);
}

function resetTimer() {
  stopTimer();
  remainingSeconds = selectedMinutes * 60;
  timerStatus.textContent = 'READY TO FOCUS';
  paintTimer();
}

presets.forEach(button => {
  button.addEventListener('click', () => {
    presets.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    selectedMinutes = Number(button.dataset.minutes);
    resetTimer();
  });
});
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
document.getElementById('year').textContent = new Date().getFullYear();
renderTasks();
paintTimer();
