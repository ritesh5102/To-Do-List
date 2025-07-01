document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const dueDate = document.getElementById('due-date');
  const tasksContainer = document.getElementById('tasks');
  const searchInput = document.getElementById('search');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function renderTasks(filter = '') {
    tasksContainer.innerHTML = '';

    tasks
      .filter(task => task.text.toLowerCase().includes(filter.toLowerCase()))
      .forEach(task => {
        const div = document.createElement('div');
        div.className = 'task' + (task.done ? ' done' : '');
        div.innerHTML = `
          <span>
            ${task.text}
            ${task.dueDate ? `<small> (Due: ${task.dueDate})</small>` : ''}
          </span>
          <div>
            <button class="done-btn">${task.done ? 'Undo' : 'Done'}</button>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </div>
        `;

        div.querySelector('.done-btn').addEventListener('click', () => {
          task.done = !task.done;
          saveTasks();
          renderTasks(searchInput.value);
        });

        div.querySelector('.edit-btn').addEventListener('click', () => {
          const newText = prompt('Edit task', task.text);
          if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            saveTasks();
            renderTasks(searchInput.value);
          }
        });

        div.querySelector('.delete-btn').addEventListener('click', () => {
          tasks = tasks.filter(t => t !== task);
          saveTasks();
          renderTasks(searchInput.value);
        });

        tasksContainer.appendChild(div);
      });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if (text !== '') {
      tasks.push({
        text,
        done: false,
        dueDate: dueDate.value || null,
      });
      saveTasks();
      input.value = '';
      dueDate.value = '';
      renderTasks(searchInput.value);
    }
  });

  searchInput.addEventListener('input', () => {
    renderTasks(searchInput.value);
  });

  renderTasks();
});
