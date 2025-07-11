        let todos = [];
        let currentFilter = 'all';

        const taskInput = document.querySelector('.task-input');
        const dateInput = document.querySelector('.date-input');
        const addBtn = document.querySelector('.add-btn');
        const tableBody = document.getElementById('todoTableBody');
        const confirmModal = document.getElementById('confirmModal');
        const modalMessage = document.getElementById('modalMessage');
        const confirmBtn = document.getElementById('confirmBtn');
        const cancelBtn = document.getElementById('cancelBtn');

        // Event listeners
        addBtn.addEventListener('click', addTodo);
        taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTodo();
            }
        });

        // Modal event listeners
        cancelBtn.addEventListener('click', hideModal);
        confirmModal.addEventListener('click', function(e) {
            if (e.target === confirmModal) {
                hideModal();
            }
        });

        // Close dropdown when clicking outside
        window.addEventListener('click', function(e) {
            if (!e.target.matches('.filter-btn')) {
                const dropdown = document.getElementById('filterDropdown');
                const filterDropdown = document.querySelector('.filter-dropdown');
                if (filterDropdown.classList.contains('show')) {
                    filterDropdown.classList.remove('show');
                }
            }
        });

        // Notification function
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('show');
            }, 100);

            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        // Modal functions
        function showModal(message, onConfirm) {
            modalMessage.textContent = message;
            confirmModal.style.display = 'block';
            
            confirmBtn.onclick = function() {
                onConfirm();
                hideModal();
            };
        }

        function hideModal() {
            confirmModal.style.display = 'none';
        }

        function addTodo() {
            const taskText = taskInput.value.trim();
            const dueDate = dateInput.value;

            if (taskText === '') {
                showNotification('Please enter a task!', 'error');
                return;
            }

            const newTodo = {
                id: Date.now(),
                text: taskText,
                dueDate: dueDate,
                completed: false,
                createdAt: new Date()
            };

            todos.push(newTodo);
            taskInput.value = '';
            dateInput.value = '';
            
            showNotification('Task added successfully!', 'success');
            renderTodos();
        }

        function deleteTodo(id) {
            const todo = todos.find(t => t.id === id);
            showModal(`Are you sure you want to delete "${todo.text}"?`, function() {
                todos = todos.filter(todo => todo.id !== id);
                showNotification('Task deleted successfully!', 'success');
                renderTodos();
            });
        }

        function toggleComplete(id) {
            const todo = todos.find(t => t.id === id);
            todo.completed = !todo.completed;
            
            const message = todo.completed ? 
                'Task marked as completed!' : 
                'Task marked as pending!';
            const type = todo.completed ? 'success' : 'info';
            
            showNotification(message, type);
            renderTodos();
        }

        function deleteAllTasks() {
            if (todos.length === 0) {
                showNotification('No tasks to delete!', 'warning');
                return;
            }
            
            showModal('Are you sure you want to delete all tasks?', function() {
                todos = [];
                showNotification('All tasks deleted successfully!', 'success');
                renderTodos();
            });
        }

        // Filter dropdown toggle
        function toggleFilterDropdown() {
            const filterDropdown = document.querySelector('.filter-dropdown');
            filterDropdown.classList.toggle('show');
        }

        function filterTasks(filter) {
            currentFilter = filter;
            
            // Update active state in dropdown
            const filterOptions = document.querySelectorAll('.filter-option');
            filterOptions.forEach(option => {
                option.classList.remove('active');
                if (option.dataset.filter === filter) {
                    option.classList.add('active');
                }
            });

            // Update filter button text
            const filterBtn = document.querySelector('.filter-btn');
            const filterNames = {
                'all': 'All',
                'pending': 'Pending', 
                'completed': 'Completed'
            };
            filterBtn.textContent = `${filterNames[filter]} ▼`;

            // Close dropdown
            document.querySelector('.filter-dropdown').classList.remove('show');
            
            // Show notification
            showNotification(`Showing ${filterNames[filter].toLowerCase()} tasks`, 'info');
            
            renderTodos();
        }

        function formatDate(dateString) {
            if (!dateString) return 'No date';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }

        function renderTodos() {
            let filteredTodos = todos;

            if (currentFilter === 'completed') {
                filteredTodos = todos.filter(todo => todo.completed);
            } else if (currentFilter === 'pending') {
                filteredTodos = todos.filter(todo => !todo.completed);
            }

            if (filteredTodos.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="4" class="empty-state">No task found</td>
                    </tr>
                `;
                return;
            }

            tableBody.innerHTML = filteredTodos.map(todo => `
                <tr>
                    <td>${todo.text}</td>
                    <td>${formatDate(todo.dueDate)}</td>
                    <td>
                        <span class="status-badge ${todo.completed ? 'status-completed' : 'status-pending'}">
                            ${todo.completed ? 'Completed' : 'Pending'}
                        </span>
                    </td>
                    <td class="task-actions">
                        <button class="action-btn complete-btn" onclick="toggleComplete(${todo.id})" title="${todo.completed ? 'Mark as pending' : 'Mark as completed'}">
                            ${todo.completed ? '↶' : '✓'}
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteTodo(${todo.id})" title="Delete task">
                            ×
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        // Initialize
        renderTodos();