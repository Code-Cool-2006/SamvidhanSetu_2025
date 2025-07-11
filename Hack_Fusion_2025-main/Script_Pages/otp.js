if (!localStorage.getItem('validPhoneNumbers')) {
    const validNumbers = [
        '9876543210',
        '8765432109',
        '7654321098',
        '6543210987',
        '5432109876',
        '6364433736'
    ];
    localStorage.setItem('validPhoneNumbers', JSON.stringify(validNumbers));
}

let timerElement = document.getElementById("timer");
let resendButton = document.getElementById("request");
let verifyBtn = document.getElementById("verifyBtn");
let inputs = document.querySelectorAll(".input-phone");
let timeLeft = 30;
let OTP = "";
let expireInterval = null;

// Add input event listeners for auto-focus
inputs.forEach((input, index) => {
    // Handle input
    input.addEventListener('input', function(e) {
        if (this.value.length === 1) {
            // Move to next input if available
            if (index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        }
    });

    // Handle backspace
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && !this.value && index > 0) {
            // Move to previous input on backspace if current input is empty
            inputs[index - 1].focus();
        }
    });

    // Handle paste
    input.addEventListener('paste', function(e) {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 4);
        if (/^\d+$/.test(pastedData)) {
            // Fill all inputs with pasted data
            pastedData.split('').forEach((digit, i) => {
                if (inputs[i]) {
                    inputs[i].value = digit;
                }
            });
            // Focus the next empty input or the last input
            const nextEmptyIndex = pastedData.length;
            if (nextEmptyIndex < inputs.length) {
                inputs[nextEmptyIndex].focus();
            } else {
                inputs[inputs.length - 1].focus();
            }
        }
    });
});

function isValidPhoneNumber(phoneNumber) {
    const validNumbers = JSON.parse(localStorage.getItem('validPhoneNumbers'));
    return validNumbers.includes(phoneNumber);
}

function startTimer() {
    timeLeft = 30;
    timerElement.innerText = timeLeft + "s";
    resendButton.disabled = true;

    let countdown = setInterval(function () {
        if (timeLeft <= 0) {
            clearInterval(countdown);
            timerElement.innerHTML = "Expired";
            resendButton.disabled = false;
            disableInputs();
        } else {
            timerElement.innerHTML = timeLeft + "s";
        }
        timeLeft -= 1;
    }, 1000);
}

function generateOTP() {
    OTP = Math.floor(1000 + Math.random() * 9000).toString();
    alert("Your OTP is: " + OTP);
    enableInputs();
    startTimer();
    // Focus the first input after generating OTP
    inputs[0].focus();
}

function enableInputs() {
    inputs.forEach((input) => {
        input.disabled = false;
        input.value = "";
    });
}

function disableInputs() {
    inputs.forEach((input) => {
        input.disabled = true;
    });
}

verifyBtn.addEventListener("click", () => {
    let enteredOTP = "";
    inputs.forEach((input) => (enteredOTP += input.value));

    if (enteredOTP === OTP) {
        alert("Access Granted..!!");
        window.location.href = 'Dashboard.html';            
    } else {
        alert("Your Verification has failed..!!");
    }
});

resendButton.addEventListener("click", generateOTP);

window.addEventListener("load", function () {
    let phoneNumber = prompt("Please enter your 10-digit mobile number");
    const isValid = /^\d{10}$/.test(phoneNumber);

    if (isValid) {
        if (isValidPhoneNumber(phoneNumber)) {
            document.getElementById('Aadhar').textContent = phoneNumber;
            generateOTP();
        } else {
            alert("This phone number is not registered in our database. Please contact support.");
            location.reload();
        }
    } else {
        alert("Invalid number. Please enter a valid 10-digit mobile number.");
        location.reload();
    }
});