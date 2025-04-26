angular.module('taskTrackerApp', [])
.controller('TaskController', ['$scope', '$http', function($scope, $http) {
    $scope.tasks = [];
    $scope.newTask = {};
    $scope.searchText = '';
    $scope.statusFilter = '';
    $scope.showEditModal = false;
    $scope.editTaskData = {};

    // Fetch all tasks
    $scope.getTasks = function() {
        $http.get('http://localhost:3000/tasks')
            .then(function(response) {
                $scope.tasks = response.data;
            }, function(error) {
                toastr.error('Error fetching tasks');
            });
    };

    // Add a new task
    $scope.addTask = function() {
        if (!$scope.newTask.title) return;
        $http.post('http://localhost:3000/tasks', $scope.newTask)
            .then(function(response) {
                $scope.tasks.push(response.data);
                $scope.newTask = {};
                toastr.success('Task added successfully');
            }, function(error) {
                toastr.error('Error adding task');
            });
    };

    // Update a task
    $scope.updateTask = function(task) {
        $http.put('http://localhost:3000/tasks/' + task._id, task)
            .then(function(response) {
                toastr.success('Task updated successfully');
            }, function(error) {
                toastr.error('Error updating task');
            });
    };

    // Delete a task
    $scope.deleteTask = function(id) {
        $http.delete('http://localhost:3000/tasks/' + id)
            .then(function(response) {
                $scope.tasks = $scope.tasks.filter(task => task._id !== id);
                toastr.success('Task deleted successfully');
            }, function(error) {
                toastr.error('Error deleting task');
            });
    };

    // Edit task
    $scope.editTask = function(task) {
        $scope.editTaskData = angular.copy(task);
        $scope.editTaskData.dueDate = task.dueDate ? new Date(task.dueDate) : null;
        $scope.showEditModal = true;
    };

    // Save edited task
    $scope.saveTask = function() {
        $http.put('http://localhost:3000/tasks/' + $scope.editTaskData._id, $scope.editTaskData)
            .then(function(response) {
                const index = $scope.tasks.findIndex(t => t._id === $scope.editTaskData._id);
                $scope.tasks[index] = response.data;
                $scope.showEditModal = false;
                toastr.success('Task updated successfully');
            }, function(error) {
                toastr.error('Error updating task');
            });
    };

    // Close edit modal
    $scope.closeEditModal = function() {
        $scope.showEditModal = false;
    };

    // Clear all tasks
    $scope.clearAllTasks = function() {
        if (confirm('Are you sure you want to delete all tasks?')) {
            $http.delete('http://localhost:3000/tasks')
                .then(function(response) {
                    $scope.tasks = [];
                    toastr.success('All tasks cleared');
                }, function(error) {
                    toastr.error('Error clearing tasks');
                });
        }
    };

    // Status filter function
    $scope.statusFilterFn = function(task) {
        if ($scope.statusFilter === 'completed') return task.completed;
        if ($scope.statusFilter === 'pending') return !task.completed;
        return true;
    };

    // Initialize
    $scope.getTasks();
}]);