
// Todo List Variables
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let taskdone = 0;
function saveTodos() {
    taskdone = todos.length;
    todos.forEach((todo) => {
        if(!todo.completed){
            taskdone--;
        }
    });
    document.getElementById('completed-tasks').textContent = taskdone;
    localStorage.setItem('todos', JSON.stringify(todos));
   
}

function sortTasks(by = 'priority') {

    if (by === 'priority') {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        todos.sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    } else if (by === 'date') {
        todos.sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
        });
    }
    renderTodos();
    saveTodos();
}

function renderTodos() {
    const todoList = document.getElementById('todo-list');
   
    if (todos.length === 0) {
        todoList.innerHTML = `
            <div class="todo-empty-state">
                <i class="fas fa-tasks"></i>
                <p>No tasks yet. Add one to get started!</p>
            </div>
        `;
        return;
    }
    
    todoList.innerHTML = '';
  
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
       
      
        li.className = `todo-item priority-${todo.priority} ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}
                   aria-label="${todo.completed ? 'Mark as incomplete' : 'Mark as complete'}">
            <span class="todo-text">${todo.text}</span>
            ${todo.dueDate ? `<span class="due-date" title="Due date">
                <i class="far fa-calendar-alt"></i> ${new Date(todo.dueDate).toLocaleDateString()}
            </span>` : ''}
            <div class="todo-actions">
                <button class="priority-btn" title="Change priority">⚡</button>
                <button class="delete-note-btn" data-index="${index}" aria-label="Delete task">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        
        li.querySelector('.todo-checkbox').addEventListener('change', function() {
            todos[index].completed = this.checked;
            li.classList.toggle('completed', this.checked);
           
          
            saveTodos();
          
        });
        
        li.querySelector('.delete-note-btn').addEventListener('click', function() {
            
                todos.splice(index, 1);
                saveTodos();
                renderTodos();
            
        });
        
        li.querySelector('.priority-btn').addEventListener('click', function() {
            const priorities = ['low', 'medium', 'high'];
            const currentIndex = priorities.indexOf(todos[index].priority);
            const nextIndex = (currentIndex + 1) % priorities.length;
            todos[index].priority = priorities[nextIndex];
            li.className = `todo-item priority-${todos[index].priority} ${todo.completed ? 'completed' : ''}`;
            saveTodos();
        });
        
        todoList.appendChild(li);
        if(!todo.completed){
            taskdone--;
        }
    });
}

document.querySelector('.todo-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('todo-input');
    const priority = document.getElementById('priority-select').value;
    const dueDate = document.getElementById('due-date').value;
    const taskText = input.value.trim();
    
    if (taskText) {
        todos.push({
            text: taskText,
            priority: priority,
            dueDate: dueDate || null,
            completed: false,
            createdAt: new Date().toISOString()
        });
        saveTodos();
        renderTodos();
        input.value = '';
        input.focus();
    }
});

// Export/Import Todos
document.getElementById('export-todos').addEventListener('click', function() {
    if (todos.length === 0) {
        alert('No tasks to export!');
        return;
    }
    
    const data = JSON.stringify(todos, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusflow-tasks-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
});

document.getElementById('import-todos').addEventListener('click', function() {
    document.getElementById('todo-import-file').click();
});

document.getElementById('todo-import-file').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const importedTodos = JSON.parse(event.target.result);
            if (Array.isArray(importedTodos)) {
                if (confirm(`Import ${importedTodos.length} tasks? This will replace your current tasks.`)) {
                    todos = importedTodos;
                    saveTodos();
                    renderTodos();
                }
            } else {
                alert('Invalid file format - must be an array of tasks');
            }
        } catch (error) {
            alert('Error importing tasks: ' + error.message);
        }
        e.target.value = '';
    };
    reader.readAsText(file);
});

// Sorting buttons
document.getElementById('sort-priority').addEventListener('click', () => sortTasks('priority'));
document.getElementById('sort-date').addEventListener('click', () => sortTasks('date'));

// Initialize
renderTodos();
// Add task search functionality
document.getElementById('todo-search').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = todos.filter(todo => 
      todo.text.toLowerCase().includes(searchTerm)
    );
    renderFilteredTodos(filtered);
  });
