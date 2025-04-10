// Quiz handling functionality
class QuizManager {
    constructor() {
        this.initializeQuizHandlers();
    }

    initializeQuizHandlers() {
        // Multiple choice questions
        this.handleMultipleChoice();
        // True/False questions
        this.handleTrueFalseQuestions();
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

    // Fix the "Kiểm tra câu trả lời" function for True/False questions
    checkMultipleChoiceAnswer(btn) {
        const parentDiv = btn.closest('.exercise-section');
        const feedbackDiv = parentDiv.querySelector('.feedback');
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
            10: 'B',
            11: ['true', 'true', 'false', 'false'],
            12: ['true', 'false', 'true', 'false']
        };

        if (Array.isArray(correctAnswers[questionNumber])) {
            // Handle True/False questions
            const tfStatements = parentDiv.querySelectorAll('.tf-statement');
            let allAnswered = true;
            let correctCount = 0;
            let feedbackMessage = '';

            tfStatements.forEach((statement, index) => {
                const selectedTFOption = statement.querySelector('input[type="radio"]:checked');
                const correctValue = correctAnswers[questionNumber][index];

                if (!selectedTFOption) {
                    allAnswered = false;
                } else if (selectedTFOption.value === correctValue) {
                    correctCount++;
                } else {
                    feedbackMessage += `Phát biểu ${String.fromCharCode(97 + index)}) đúng là ${correctValue === 'true' ? 'Đúng' : 'Sai'}.<br>`;
                }
            });

            if (!allAnswered) {
                this.showFeedback(feedbackDiv, 'error', 'Vui lòng trả lời tất cả các câu hỏi.');
                return;
            }

            if (correctCount === tfStatements.length) {
                this.showFeedback(feedbackDiv, 'success', '✅ Chúc mừng! Bạn đã trả lời đúng tất cả các phát biểu.');
            } else {
                this.showFeedback(feedbackDiv, 'error', 
                    `❌ Bạn đã trả lời đúng ${correctCount}/${tfStatements.length} phát biểu.<br>${feedbackMessage}`);
            }
        } else {
            // Handle multiple-choice questions
            const selectedOption = parentDiv.querySelector('.quiz-option.selected');

            if (!selectedOption) {
                this.showFeedback(feedbackDiv, 'error', 'Vui lòng chọn một đáp án.');
                return;
            }

            const selectedLetter = selectedOption.textContent.charAt(0);
            if (selectedLetter === correctAnswers[questionNumber]) {
                this.showFeedback(feedbackDiv, 'success', '✅ Chúc mừng! Bạn đã chọn đúng đáp án.');
                window.progressManager.updateProgress('quiz');
            } else {
                this.showFeedback(feedbackDiv, 'error', `❌ Rất tiếc, đáp án chưa chính xác. Đáp án đúng là ${correctAnswers[questionNumber]}.`);
            }
        }
    }

    handleTrueFalseQuestions() {
        const tfSections = document.querySelectorAll('.tf-section');
        tfSections.forEach(section => {
            const checkBtn = section.querySelector('.check-tf-btn');
            if (checkBtn) {
                checkBtn.addEventListener('click', () => {
                    this.checkTrueFalseAnswersForSpecificQuestions(section);
                });
            }
        });
    }

    checkTrueFalseAnswersForSpecificQuestions(section) {
        const feedbackDiv = section.querySelector('.feedback');
        const tfStatements = section.querySelectorAll('.tf-statement');
        let allAnswered = true;
        let correctCount = 0;
        let feedbackMessage = '';

        tfStatements.forEach((statement, index) => {
            const selectedOption = statement.querySelector('input[type="radio"]:checked');
            const correctInput = statement.querySelector('input[data-correct="true"]');

            if (!selectedOption) {
                allAnswered = false;
            } else if (selectedOption.value === correctInput.value) {
                correctCount++;
            } else {
                const correctValue = correctInput.value;
                feedbackMessage += `Phát biểu ${String.fromCharCode(97 + index)}) đúng là ${correctValue === 'true' ? 'Đúng' : 'Sai'}.<br>`;
            }
        });

        if (!allAnswered) {
            this.showFeedback(feedbackDiv, 'error', 'Vui lòng trả lời tất cả các câu hỏi.');
            return;
        }

        if (correctCount === tfStatements.length) {
            this.showFeedback(feedbackDiv, 'success', '✅ Chúc mừng! Bạn đã trả lời đúng tất cả các phát biểu.');
        } else {
            this.showFeedback(feedbackDiv, 'error', 
                `❌ Bạn đã trả lời đúng ${correctCount}/${tfStatements.length} phát biểu.<br>${feedbackMessage}`);
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
