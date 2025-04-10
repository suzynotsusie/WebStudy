document.addEventListener('DOMContentLoaded', function() {
    // Initialize font themes
    initializeFontThemes();

    // Navigation handling
    const navLinks = document.querySelectorAll('.nav-link');
    const sectionContents = document.querySelectorAll('.section-content');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
            sectionContents.forEach(section => section.classList.add('hidden'));
            const targetSectionId = this.getAttribute('data-section') + '-section';
            document.getElementById(targetSectionId).classList.remove('hidden');
        });
    });
    
    // Start learning button
    const startLearningBtn = document.getElementById('start-learning-btn');
    if (startLearningBtn) {
        startLearningBtn.addEventListener('click', function() {
            document.querySelector('[data-section="lessons"]').click();
        });
    }
    
    // Layout options
    const layoutOptions = document.querySelectorAll('.layout-option');
    layoutOptions.forEach(option => {
        option.addEventListener('click', function() {
            layoutOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            const layoutClass = this.getAttribute('data-layout');
            document.body.className = document.body.className.replace(/layout-\S+/g, '');
            document.body.classList.add('layout-' + layoutClass);
            updatePreviewBox();
        });
    });
    
    // Color scheme options
    const colorSwatches = document.querySelectorAll('.color-swatch');
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', function() {
            colorSwatches.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            const theme = this.getAttribute('data-theme');
            document.body.className = document.body.className.replace(/theme-\S+/g, '');
            document.body.classList.add('theme-' + theme);
            updatePreviewBox();
        });
    });
    
    // Update preview box based on selected layout and theme
    function updatePreviewBox() {
        const previewBox = document.querySelector('.preview-box');
        const previewHeader = document.querySelector('.preview-header');
        const previewContent = document.querySelector('.preview-content');
        
        const theme = document.body.className.match(/theme-(\S+)/)[1];
        
        const themeStyles = {
            blue: {
                header: 'bg-blue-100',
                content: 'bg-blue-50',
                button: '#80b3ff'
            },
            pink: {
                header: 'bg-pink-100',
                content: 'bg-pink-50',
                button: '#ff99cc'
            },
            mint: {
                header: 'bg-green-100',
                content: 'bg-green-50',
                button: '#86efac'
            },
            lavender: {
                header: 'bg-purple-100',
                content: 'bg-purple-50',
                button: '#c084fc'
            }
        };
        
        const style = themeStyles[theme];
        previewHeader.className = `preview-header ${style.header} p-4`;
        previewContent.querySelector('[class*="bg-"]').className = `${style.content} p-2 rounded mb-2`;
        previewContent.querySelector('.btn-primary').style.backgroundColor = style.button;
    }
    
    // Exercise handlers
    function initializeExerciseHandlers() {
        // Quiz options
        const quizOptions = document.querySelectorAll('.quiz-option');
        quizOptions.forEach(option => {
            option.addEventListener('click', function() {
                const parentDiv = this.parentElement;
                parentDiv.querySelectorAll('.quiz-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                this.classList.add('selected');
            });
        });

        // Check answer buttons
        const checkAnswerBtns = document.querySelectorAll('.check-answer-btn');
        checkAnswerBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const parentDiv = this.closest('.exercise-section');
                const feedbackDiv = parentDiv.querySelector('.feedback');
                const selectedOption = parentDiv.querySelector('.quiz-option.selected');
                
                if (!selectedOption) {
                    showFeedback(feedbackDiv, 'error', 'Vui lòng chọn một đáp án.');
                    return;
                }
                
                if (selectedOption.hasAttribute('data-correct')) {
                    showFeedback(feedbackDiv, 'success', '✅ Chúc mừng! Bạn đã chọn đúng đáp án.');
                    updateProgress('quiz');
                } else {
                    const correctOption = parentDiv.querySelector('.quiz-option[data-correct="true"]');
                    const correctLabel = correctOption.textContent.charAt(0);
                    showFeedback(feedbackDiv, 'error', 
                        `❌ Rất tiếc, đáp án chưa chính xác.<br>Gợi ý: Đáp án đúng là ${correctLabel}.`);
                }
            });
        });

        // True/False exercises
        const checkTFBtn = document.querySelector('.check-tf-btn');
        if (checkTFBtn) {
            checkTFBtn.addEventListener('click', checkTrueFalseAnswers);
        }

        // HTML exercises
        initializeCodeEditors();
    }

    function showFeedback(element, type, message) {
        element.innerHTML = `<p class="${type}-message">${message}</p>`;
        element.classList.remove('hidden');
        element.classList.add('fade-in');
    }

    function checkTrueFalseAnswers() {
        const parentDiv = this.closest('.exercise-section');
        const feedbackDiv = parentDiv.querySelector('.feedback-tf');
        const questions = parentDiv.querySelectorAll('input[type="radio"]:checked');
        
        if (questions.length < 3) {
            showFeedback(feedbackDiv, 'error', 'Vui lòng trả lời tất cả các câu hỏi.');
            return;
        }
        
        let correctCount = 0;
        questions.forEach(question => {
            if (question.hasAttribute('data-correct')) {
                correctCount++;
            }
        });
        
        if (correctCount === 3) {
            showFeedback(feedbackDiv, 'success', '✅ Chúc mừng! Bạn đã trả lời đúng tất cả các câu hỏi.');
            updateProgress('tf');
        } else {
            showFeedback(feedbackDiv, 'error', 
                `❌ Bạn đã trả lời đúng ${correctCount}/3 câu hỏi.<br>Hãy xem lại phần lý thuyết và thử lại.`);
        }
    }

    function initializeCodeEditors() {
        // HTML Editor
        const htmlEditor = document.getElementById('html-exercise');
        const cssEditor = document.getElementById('css-exercise');
        
        if (htmlEditor) {
            const checkHtmlBtn = document.querySelector('.check-html-btn');
            const previewHtmlBtn = document.querySelector('.preview-html-btn');
            
            checkHtmlBtn.addEventListener('click', checkHtmlExercise);
            previewHtmlBtn.addEventListener('click', previewHtmlExercise);
        }
        
        if (cssEditor) {
            const checkCssBtn = document.querySelector('.check-css-btn');
            const previewCssBtn = document.querySelector('.preview-css-btn');
            
            checkCssBtn.addEventListener('click', checkCssExercise);
            previewCssBtn.addEventListener('click', previewCssExercise);
        }
    }

    // Progress tracking
    let completedExercises = [];
    
    function updateProgress(exerciseType) {
        if (!completedExercises.includes(exerciseType)) {
            completedExercises.push(exerciseType);
            
            const progressPercentage = Math.min(Math.floor((completedExercises.length / 5) * 100), 100);
            document.getElementById('progress-percentage').textContent = progressPercentage;
            document.querySelector('.progress-bar').style.width = `${progressPercentage}%`;
            
            updateCompletedExercisesTable();
        }
    }
    
    function updateCompletedExercisesTable() {
        const table = document.getElementById('completed-exercises');
        
        if (completedExercises.length > 0) {
            table.innerHTML = '';
            
            completedExercises.forEach((type, index) => {
                const now = new Date();
                const timeString = now.toLocaleTimeString();
                const dateString = now.toLocaleDateString();
                
                const exerciseNames = {
                    quiz: 'Trắc nghiệm: Đặc điểm chung của trang web',
                    tf: 'Đúng/Sai: Các bước chuẩn bị xây dựng web',
                    html: 'Thực hành: Xây dựng dàn ý & bố cục',
                    css: 'Thực hành: Thiết kế mỹ thuật'
                };
                
                const row = document.createElement('tr');
                row.className = 'border-t';
                row.innerHTML = `
                    <td class="py-3 px-4">${exerciseNames[type] || `Bài tập ${index + 1}`}</td>
                    <td class="py-3 px-4"><span class="text-green-500">Đạt</span></td>
                    <td class="py-3 px-4">${timeString} - ${dateString}</td>
                `;
                
                table.appendChild(row);
            });
            
            // Update lessons table if all exercises are completed
            if (completedExercises.length === 5) {
                document.getElementById('completed-lessons').innerHTML = `
                    <tr class="border-t">
                        <td class="py-3 px-4">Bài 23: Chuẩn bị xây dựng trang web</td>
                        <td class="py-3 px-4"><span class="text-green-500">Hoàn thành</span></td>
                        <td class="py-3 px-4">100%</td>
                    </tr>
                `;
            }
        }
    }

    // Lightbox Gallery functionality
function initializeLightboxGallery() {
    // Create lightbox elements
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
        <div class="lightbox-content">
            <img class="lightbox-image" src="" alt="">
            <div class="lightbox-nav">
                <button class="lightbox-prev"><i class="fas fa-chevron-left"></i></button>
                <button class="lightbox-next"><i class="fas fa-chevron-right"></i></button>
            </div>
            <button class="lightbox-close"><i class="fas fa-times"></i></button>
            <div class="lightbox-caption"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Get all lesson images
    const images = document.querySelectorAll('.lesson-content img');
    const imageArray = Array.from(images);
    let currentIndex = 0;

    // Add click handlers to all images
    images.forEach((img, index) => {
        img.addEventListener('click', () => {
            currentIndex = index;
            showImage(currentIndex);
        });
    });

    // Navigation functions
    function showImage(index) {
        const lightboxImg = overlay.querySelector('.lightbox-image');
        const caption = overlay.querySelector('.lightbox-caption');
        lightboxImg.src = imageArray[index].src;
        lightboxImg.alt = imageArray[index].alt;
        caption.textContent = imageArray[index].closest('div').querySelector('p').textContent;
        overlay.classList.add('active');
    }

    // Previous button
    overlay.querySelector('.lightbox-prev').addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + imageArray.length) % imageArray.length;
        showImage(currentIndex);
    });

    // Next button
    overlay.querySelector('.lightbox-next').addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % imageArray.length;
        showImage(currentIndex);
    });

    // Close on overlay click
    overlay.addEventListener('click', () => {
        overlay.classList.remove('active');
    });

    // Prevent closing when clicking on content
    overlay.querySelector('.lightbox-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Close button
    overlay.querySelector('.lightbox-close').addEventListener('click', () => {
        overlay.classList.remove('active');
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            overlay.classList.remove('active');
        } else if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + imageArray.length) % imageArray.length;
            showImage(currentIndex);
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % imageArray.length;
            showImage(currentIndex);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    initializeLightboxGallery();
});

    // Font theme functionality
function initializeFontThemes() {
    const fontThemeBoxes = document.querySelectorAll('.font-theme-box');
    
    fontThemeBoxes.forEach(box => {
        box.addEventListener('click', function() {
            // Remove active class from all boxes
            fontThemeBoxes.forEach(b => b.classList.remove('active'));
            // Add active class to clicked box
            this.classList.add('active');
            
            // Get the font family
            const fontFamily = this.getAttribute('data-font');
            
            // Remove all existing font theme classes
            document.body.classList.remove(
                'theme-font-montserrat',
                'theme-font-playfair',
                'theme-font-roboto',
                'theme-font-source'
            );
            
            // Add new font theme class
            document.body.classList.add(`theme-font-${fontFamily.toLowerCase().replace(' ', '-')}`);
        });
    });
}

    // Initialize exercise handlers
    initializeExerciseHandlers();
});
