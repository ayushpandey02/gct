"use strict";
// Track current step
let currentStep = 1;
const totalSteps = 3;

// Function to show loading overlay
function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
    }
}

// Function to hide loading overlay
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}


// Function to handle file uploads
function handleFileUpload(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    if (!input || !preview) return;
    
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.classList.remove('hidden');
                const previewImg = preview.querySelector('img');
                if (previewImg) {
                    previewImg.src = e.target.result;
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

// Function to setup drag and drop
function setupDragAndDrop(dropZone, fileInput) {
    if (!dropZone || !fileInput) return;

    const events = ['dragenter', 'dragover', 'dragleave', 'drop'];
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        dropZone.classList.add('border-indigo-500', 'border-2');
    }

    function unhighlight(e) {
        dropZone.classList.remove('border-indigo-500', 'border-2');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        
        if (file) {
            fileInput.files = dt.files;
            // Trigger change event manually
            fileInput.dispatchEvent(new Event('change'));
        }
    }

    // Add event listeners safely
    events.forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    dropZone.addEventListener('drop', handleDrop, false);
}

// Function to update steps UI
function updateSteps() {
    // Update step indicators
    document.querySelectorAll('.step-item').forEach((step, index) => {
        const stepNum = index + 1;
        const stepDiv = step.querySelector('div');
        if (!stepDiv) return;

        stepDiv.classList.remove('bg-gray-300', 'bg-indigo-600', 'bg-green-600');

        if (stepNum < currentStep) {
            stepDiv.classList.add('bg-green-600');
        } else if (stepNum === currentStep) {
            stepDiv.classList.add('bg-indigo-600');
        } else {
            stepDiv.classList.add('bg-gray-300');
        }
    });

    // Show current step content and hide others
    document.querySelectorAll('.step-content').forEach((content, index) => {
        if (index + 1 === currentStep) {
            content.classList.remove('hidden');
        } else {
            content.classList.add('hidden');
        }
    });

    // Update button visibility
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    if (!prevBtn || !nextBtn || !submitBtn) return;

    if (currentStep === 1) {
        prevBtn.classList.add('hidden');
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    } else if (currentStep === totalSteps) {
        prevBtn.classList.remove('hidden');
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
    } else {
        prevBtn.classList.remove('hidden');
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }
}

// Validate step fields
function validateStep(stepNumber) {
    const stepElement = document.getElementById(`step${stepNumber}`);
    if (!stepElement) return false;

    let isValid = true;
    let errorMessage = '';

    // Get all required inputs in current step
    const requiredInputs = stepElement.querySelectorAll('input[required]');

    requiredInputs.forEach(input => {
        // Reset validation styling
        input.classList.remove('border-red-500');

        // Check if input is a radio button group
        if (input.type === 'radio') {
            const radioGroupName = input.name;
            const radioGroup = stepElement.querySelectorAll(`input[name="${radioGroupName}"]`);
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);

            if (!isChecked) {
                isValid = false;
                errorMessage += `Please select a ${radioGroupName}\n`;
                radioGroup.forEach(radio => {
                    const radioDiv = radio.closest('div');
                    if (radioDiv) {
                        radioDiv.classList.add('border-red-500');
                    }
                });
            }
        }
        // Check file inputs
        else if (input.type === 'file') {
            if (!input.files || input.files.length === 0) {
                isValid = false;
                errorMessage += `Please upload a ${input.name}\n`;
                const dashed = input.closest('.border-dashed');
                if (dashed) {
                    dashed.classList.add('border-red-500');
                }
            }
        }
        // Check other input types
        else if (!input.value.trim()) {
            isValid = false;
            errorMessage += `${input.name} is required\n`;
            input.classList.add('border-red-500');
        }
    });

    // Step-specific validation
    if (stepNumber === 1) {
        const ageInput = document.getElementById('age');
        const moibleInput = document.querySelector('mobile')
        if (ageInput) {
            const age = parseInt(ageInput.value);
            if (age < 13 || age > 45) {
                isValid = false;
                errorMessage += 'Age must be between 13 and 45 years\n';
                ageInput.classList.add('border-red-500');
            }
        }

        if(moibleInput) {
            const mobile = parseInt(moibleInput.value)
            if(mobile.length() != 10){
                isValid = false;
                errorMessage += 'Mobile Number should be 10 digits';
                moibleInput.classList.add('border-red-500');
            }
        }
    }

    if (errorMessage) {
        alert(errorMessage);
    }

    return isValid;
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    try {
        // Initialize file upload handlers
        handleFileUpload('photo', 'photoPreview');
        handleFileUpload('paymentScreenshot', 'screenshotPreview');

        // Setup drag and drop
        const photoInput = document.getElementById('photo');
        const screenshotInput = document.getElementById('paymentScreenshot');
        
        if (photoInput && screenshotInput) {
            const photoDropZone = photoInput.closest('.border-dashed');
            const screenshotDropZone = screenshotInput.closest('.border-dashed');

            if (photoDropZone && screenshotDropZone) {
                setupDragAndDrop(photoDropZone, photoInput);
                setupDragAndDrop(screenshotDropZone, screenshotInput);
            }
        }

        // Navigation button handlers
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const registrationForm = document.getElementById('registrationForm');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentStep > 1) {
                    currentStep--;
                    updateSteps();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (validateStep(currentStep)) {
                    if (currentStep < totalSteps) {
                        currentStep++;
                        updateSteps();
                    }
                }
            });
        }

        // Form submission handler
        if (registrationForm) {
            registrationForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = document.getElementById('submitBtn');
                btn.classList.add('disabled')

                if (validateStep(currentStep)) {
                    try {
                        showLoading();
                        const originalFormData = new FormData(registrationForm);
                        const formData = new FormData();
                        
                        // Map to match backend schema
                        formData.append('name', originalFormData.get('name'));
                        formData.append('age', originalFormData.get('age'));
                        formData.append('mobileNumber', originalFormData.get('mobile'));
                        formData.append('wardNumber', originalFormData.get('ward'));
                        formData.append('role', originalFormData.get('playerType'));
                        formData.append('upiTransactionId', originalFormData.get('upiId'));
                        
                        // Map files
                        const photoFile = originalFormData.get('photo');
                        const screenshotFile = originalFormData.get('paymentScreenshot');
                        formData.append('photo', photoFile);
                        formData.append('paymentScreenshot', screenshotFile);
            
                        const response = await fetch('https://gct-backend-phi.vercel.app/api/v1/user/submit-form', {
                            method: 'POST',
                            credentials: 'omit',  // Changed from 'include' to 'omit'
                            body: formData
                        });
                        
                        const result = await response.json();
                        hideLoading();
                        
                        if (result.error) {
                            throw new Error(result.error);
                        }
                        alert('Registration successful!');
                        
                    } catch (error) {
                        hideLoading();
                        alert(error.message);
                    }
                }
            });
        }

        // Initialize the form
        updateSteps();
    } catch (error) {
        console.error('Error initializing form:', error);
    }
});