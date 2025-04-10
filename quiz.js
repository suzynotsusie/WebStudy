// Quiz handling functionality
class QuizManager {
    constructor() {
        this.initializeQuizHandlers();
    }

    initializeQuizHandlers() {
        // Multiple choice questions
        this.handleMultipleChoice();
        // True/False questions
        this.handleTrueFalse();
    }

    handleMultipleChoice() {
        const quizOptions = document.querySelectorAll('.quiz-option');
        const checkAnswerBtns = document.querySelectorAll('.check-answer-btn');

        quizOptions.forEach(option => {
            option.addEventListener('click', () => {
                const parentDiv = option.parentElement;
                parentDiv.querySelectorAll('.quiz-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                option.classList.add('selected');
            });
        });

        checkAnswerBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.checkMultipleChoiceAnswer(btn);
            });
        });
    }

    checkMultipleChoiceAnswer(btn) {
        const parentDiv = btn.closest('.exercise-section');
        const feedbackDiv = parentDiv.querySelector('.feedback');
        const selectedOption = parentDiv.querySelector('.quiz-option.selected');

        if (!selectedOption) {
            this.showFeedback(feedbackDiv, 'error', 'Vui lòng chọn một đáp án.');
            return;
        }

        const questionNumber = parseInt(parentDiv.querySelector('.exercise-header h3').textContent.replace('Câu ', ''));
        const correctAnswers = {
            1: 'B',
            2: 'B',
            3: 'A',
            4: 'A',
            5: 'B',
            6: 'D',
            7: 'A',
            8: 'C',
            9: 'C',
            10: 'B'
        };

        const selectedLetter = selectedOption.textContent.charAt(0);
        if (selectedLetter === correctAnswers[questionNumber]) {
            this.showFeedback(feedbackDiv, 'success', '✅ Chúc mừng! Bạn đã chọn đúng đáp án.');
            window.progressManager.updateProgress('quiz');
        } else {
            this.showFeedback(feedbackDiv, 'error', 
                `❌ Rất tiếc, đáp án chưa chính xác.<br>Gợi ý: Đáp án đúng là ${correctAnswers[questionNumber]}.`);
        }
    }

    handleTrueFalse() {
        const tfSections = document.querySelectorAll('.tf-section');
        tfSections.forEach(section => {
            const checkBtn = section.querySelector('.check-tf-btn');
            if (checkBtn) {
                checkBtn.addEventListener('click', () => {
                    this.checkTrueFalseAnswers(section);
                });
            }
        });
    }

    checkTrueFalseAnswers(section) {
        const feedbackDiv = section.querySelector('.feedback');
        const statements = section.querySelectorAll('.tf-statement');
        let allAnswered = true;
        let correctCount = 0;
        const totalStatements = statements.length;

        statements.forEach(statement => {
            const selectedOption = statement.querySelector('input[type="radio"]:checked');
            if (!selectedOption) {
                allAnswered = false;
                return;
            }

            const isCorrect = selectedOption.value === statement.getAttribute('data-correct');
            if (isCorrect) correctCount++;
        });

        if (!allAnswered) {
            this.showFeedback(feedbackDiv, 'error', 'Vui lòng trả lời tất cả các câu hỏi.');
            return;
        }

        if (correctCount === totalStatements) {
            this.showFeedback(feedbackDiv, 'success', 
                '✅ Chúc mừng! Bạn đã trả lời đúng tất cả các phát biểu.');
            window.progressManager.updateProgress('tf');
        } else {
            this.showFeedback(feedbackDiv, 'error', 
                `❌ Bạn đã trả lời đúng ${correctCount}/${totalStatements} phát biểu.<br>Hãy xem lại phần lý thuyết và thử lại.`);
        }
    }

    showFeedback(element, type, message) {
        element.innerHTML = `<p class="${type}-message">${message}</p>`;
        element.classList.remove('hidden');
        element.classList.add('fade-in');
    }
}

// Initialize quiz functionality when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.quizManager = new QuizManager();
});
