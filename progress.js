// Progress tracking functionality
class ProgressManager {
    constructor() {
        this.progressBar = document.querySelector('.progress-bar');
        this.progressText = document.getElementById('progress-percentage');
        this.completedList = document.getElementById('completed-exercises');
        this.savedProgress = this.loadProgress();
        this.initializeProgress();
    }

    initializeProgress() {
        if (this.savedProgress) {
            this.updateProgressDisplay(this.savedProgress.percentage);
            this.updateCompletedList(this.savedProgress.completed);
        } else {
            this.updateProgressDisplay(0);
        }
    }

    updateProgress(type, questionId = null) {
        const currentProgress = this.savedProgress || { percentage: 0, completed: [] };
        
        if (!currentProgress.completed.includes(questionId)) {
            currentProgress.completed.push(questionId);
            const totalQuestions = document.querySelectorAll('.exercise-section').length;
            currentProgress.percentage = Math.round((currentProgress.completed.length / totalQuestions) * 100);
            
            this.updateProgressDisplay(currentProgress.percentage);
            this.updateCompletedList(currentProgress.completed);
            this.saveProgress(currentProgress);
        }
    }

    updateProgressDisplay(percentage) {
        if (this.progressBar && this.progressText) {
            this.progressBar.style.width = `${percentage}%`;
            this.progressText.textContent = percentage;
        }
    }

    updateCompletedList(completed) {
        if (this.completedList) {
            if (completed.length === 0) {
                this.completedList.innerHTML = '<tr><td colspan="3" class="py-3 px-4 text-center">Chưa có bài tập nào được hoàn thành</td></tr>';
            } else {
                // Update the completed exercises table
                completed.forEach(item => {
                    if (!this.completedList.querySelector(`[data-exercise="${item}"]`)) {
                        this.addCompletedExercise(item);
                    }
                });
            }
        }
    }

    addCompletedExercise(exerciseId) {
        const row = document.createElement('tr');
        row.setAttribute('data-exercise', exerciseId);
        row.className = 'border-t';
        
        const timestamp = new Date().toLocaleString('vi-VN');
        row.innerHTML = `
            <td class="py-3 px-4">Bài ${exerciseId}</td>
            <td class="py-3 px-4">
                <span class="inline-block px-2 py-1 rounded bg-green-100 text-green-800">Hoàn thành</span>
            </td>
            <td class="py-3 px-4">${timestamp}</td>
        `;
        
        this.completedList.appendChild(row);
    }

    saveProgress(progress) {
        localStorage.setItem('quizProgress', JSON.stringify(progress));
    }

    loadProgress() {
        const saved = localStorage.getItem('quizProgress');
        return saved ? JSON.parse(saved) : null;
    }

    resetProgress() {
        localStorage.removeItem('quizProgress');
        this.updateProgressDisplay(0);
        if (this.completedList) {
            this.completedList.innerHTML = '<tr><td colspan="3" class="py-3 px-4 text-center">Chưa có bài tập nào được hoàn thành</td></tr>';
        }
    }
}
