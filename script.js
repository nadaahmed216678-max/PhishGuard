
const startButton = document.getElementById("startQuiz");
const quizArea = document.getElementById("quiz");
const messageInput = document.getElementById("messageInput");
const analysisResult = document.getElementById("analysisResult");

const questions = [
    {
        question: "1. You receive an email asking you to verify your password immediately. What should you do?",
        options: [
            "Click the link immediately",
            "Verify the request through the official website",
            "Reply with your password"
        ],
        answer: 1
    },
    {
        question: "2. Which is a common warning sign of phishing?",
        options: [
            "An unexpected message creating urgency",
            "A familiar website you opened yourself",
            "A routine message you expected"
        ],
        answer: 0
    },
    {
        question: "3. A message says you won a prize but must pay a fee first. What is the safest response?",
        options: [
            "Pay the fee",
            "Share your account details",
            "Treat it as suspicious and verify independently"
        ],
        answer: 2
    }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

function showQuestion() {
    if (currentQuestion >= questions.length) {
        quizArea.replaceChildren();

        const resultTitle = document.createElement("h2");
        resultTitle.textContent = "Quiz Completed!";

        const resultText = document.createElement("p");
        resultText.textContent =
            `Your score: ${score} out of ${questions.length}`;

        const restartButton = document.createElement("button");
        restartButton.className = "button button-primary";
        restartButton.textContent = "Try Again";
        restartButton.addEventListener("click", startQuiz);

        quizArea.append(resultTitle, resultText, restartButton);
        return;
    }

    answered = false;
    const item = questions[currentQuestion];
    quizArea.replaceChildren();

    const progress = document.createElement("progress");
    progress.max = questions.length;
    progress.value = currentQuestion;

    const heading = document.createElement("h2");
    heading.textContent = item.question;

    const form = document.createElement("div");
    form.id = "quizOptions";

    item.options.forEach((option, index) => {
        const label = document.createElement("label");
        const radio = document.createElement("input");

        radio.type = "radio";
        radio.name = "quizAnswer";
        radio.value = index;

        label.append(radio, document.createTextNode(option));
        form.appendChild(label);
    });

    const feedback = document.createElement("p");
    feedback.id = "quizFeedback";
    feedback.setAttribute("aria-live", "polite");

    const checkButton = document.createElement("button");
    checkButton.className = "button button-primary";
    checkButton.textContent = "Check Answer";

    checkButton.addEventListener("click", () => {
        if (answered) return;

        const selected = quizArea.querySelector(
            'input[name="quizAnswer"]:checked'
        );

        if (!selected) {
            feedback.textContent = "Please select an answer first.";
            return;
        }

        answered = true;
        const correct = Number(selected.value) === item.answer;

        if (correct) score++;

        feedback.textContent = correct
            ? "Correct! Well done."
            : `Not quite. Correct answer: ${item.options[item.answer]}`;

        const nextButton = document.createElement("button");
        nextButton.className = "button button-secondary";
        nextButton.textContent =
            currentQuestion === questions.length - 1
                ? "See Results"
                : "Next Question";

        nextButton.addEventListener("click", () => {
            currentQuestion++;
            showQuestion();
        });

        quizArea.appendChild(nextButton);
        checkButton.disabled = true;
    });

    quizArea.append(progress, heading, form, checkButton, feedback);
}

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    showQuestion();
}

startButton.addEventListener("click", startQuiz);


/* ===== Enhanced Phishing Message Checker ===== */

const suspiciousPatterns = [
    {
        name: "Sensitive information request",
        pattern: /\b(password|login details|verification code|otp|pin)\b/i,
        message: "The message mentions passwords, login details, or verification codes."
    },
    {
        name: "Urgent or threatening language",
        pattern: /\b(urgent|immediately|account suspended|account will be locked|act now|within 24 hours)\b/i,
        message: "The message uses urgency or threats to pressure the recipient."
    },
    {
        name: "Suspicious payment or prize",
        pattern: /\b(claim your prize|you won|pay a fee|payment required|free gift)\b/i,
        message: "The message mentions an unexpected prize or payment request."
    },
    {
        name: "Account verification request",
        pattern: /\b(verify your account|confirm your identity|update your account)\b/i,
        message: "The message requests account verification. Confirm it independently."
    }
];

const shortenedDomains = [
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "is.gd",
    "ow.ly",
    "rb.gy",
    "cutt.ly"
];

function extractUrls(text) {
    return text.match(/\b(?:https?:\/\/|www\.)[^\s<>"']+/gi) || [];
}

function analyzeUrl(url) {
    const warnings = [];

    let parsedUrl;

    try {
        const normalizedUrl = /^https?:\/\//i.test(url)
            ? url
            : `https://${url}`;

        parsedUrl = new URL(normalizedUrl);
    } catch {
        return ["A URL could not be parsed reliably. Verify it manually."];
    }

    const hostname = parsedUrl.hostname.toLowerCase();

    if (parsedUrl.protocol === "http:") {
        warnings.push("This link uses HTTP instead of HTTPS.");
    }

    if (shortenedDomains.includes(hostname)) {
        warnings.push("This is a URL-shortening domain that hides the final destination.");
    }

    if (hostname.includes("xn--")) {
        warnings.push("The domain contains encoded international characters. Verify it carefully.");
    }

    if (parsedUrl.username || parsedUrl.password) {
        warnings.push("The URL contains text before the hostname that may be misleading.");
    }

    if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)) {
        warnings.push("The link uses an IP address instead of a typical domain name.");
    }

    return warnings;
}

document.getElementById("checkMessage").addEventListener("click", () => {
    const message = messageInput.value.trim();

    if (!message) {
        analysisResult.textContent = "Please enter a message to analyze.";
        return;
    }

    const warnings = [];

    // Check for suspicious message patterns.
    for (const item of suspiciousPatterns) {
        if (item.pattern.test(message)) {
            warnings.push(item.message);
        }
    }

    // Inspect URLs as text only. Never open or visit them.
    const urls = extractUrls(message);

    for (const url of urls) {
        const urlWarnings = analyzeUrl(url);

        for (const warning of urlWarnings) {
            warnings.push(`Link: ${url} — ${warning}`);
        }
    }

    // Build the result safely using textContent.
    analysisResult.replaceChildren();

    const heading = document.createElement("h3");
    const summary = document.createElement("p");
    const list = document.createElement("ul");

    if (warnings.length >= 3) {
        heading.textContent = "High Number of Warning Signs";
        heading.style.color = "#b91c1c";
    } else if (warnings.length > 0) {
        heading.textContent = "Potential Warning Signs Detected";
        heading.style.color = "#b45309";
    } else {
        heading.textContent = "No Common Warning Signs Detected";
        heading.style.color = "#047857";
    }

    if (warnings.length > 0) {
        summary.textContent = `Found ${warnings.length} potential warning sign(s).`;

        warnings.forEach((warning) => {
            const item = document.createElement("li");
            item.textContent = warning;
            list.appendChild(item);
        });
    } else {
        summary.textContent =
            "The basic checks did not identify any known warning patterns.";
    }

    const advice = document.createElement("p");
    advice.textContent =
        "Safety advice: Do not share passwords or verification codes. Verify unexpected requests through an official channel.";

    const limitation = document.createElement("p");
    limitation.textContent =
        "Important: This tool performs basic pattern checks only. HTTPS does not guarantee that a website is safe, and no warning signs does not mean a message is legitimate.";

    analysisResult.append(heading, summary);

    if (warnings.length > 0) {
        analysisResult.appendChild(list);
    }

    analysisResult.append(advice, limitation);
});

document.getElementById("clearMessage").addEventListener("click", () => {
    messageInput.value = "";
    analysisResult.replaceChildren();
});

// Safe educational simulation examples
const simulationExamples = [
    {
        message: "Your bank account will be locked! Verify your password immediately.",
        answer: "phishing",
        explanation: "It uses urgency and asks for sensitive information."
    },
    {
        message: "Your scheduled university lecture is tomorrow at 10 AM. Check your official student portal for details.",
        answer: "legitimate",
        explanation: "This is a routine notice directing you to an official portal. Verify the sender if the message is unexpected."
    },
    {
        message: "Congratulations! You won a prize. Pay a small fee now to claim it.",
        answer: "phishing",
        explanation: "Unexpected prizes and requests for payment are warning signs."
    }
];

let simulationIndex = 0;
let simulationAnswered = false;
let simulationScore = 0;
let simulationCompleted = 0;

const simulationMessage = document.getElementById("simulationMessage");
const simulationFeedback = document.getElementById("simulationFeedback");
const simulationProgress = document.getElementById("simulationProgress");
const phishingButton = document.getElementById("phishingChoice");
const legitimateButton = document.getElementById("legitimateChoice");
const nextSimulationButton = document.getElementById("nextSimulation");

function showSimulation() {
    const example = simulationExamples[simulationIndex];

    simulationMessage.textContent = example.message;
    simulationFeedback.textContent = "";
    simulationProgress.textContent =
        `Example ${simulationIndex + 1} of ${simulationExamples.length}`;

    simulationAnswered = false;
    phishingButton.disabled = false;
    legitimateButton.disabled = false;
    nextSimulationButton.disabled = true;
}

function checkSimulation(choice) {
    if (simulationAnswered) return;

    simulationAnswered = true;
    simulationCompleted++;

    const example = simulationExamples[simulationIndex];
    const correct = choice === example.answer;

    if (correct) simulationScore++;

    simulationFeedback.textContent =
        `${correct ? "Correct!" : "Not quite."} ${example.explanation} ` +
        `Score: ${simulationScore}/${simulationCompleted}.`;

    phishingButton.disabled = true;
    legitimateButton.disabled = true;
    nextSimulationButton.disabled = false;

    if (simulationCompleted === simulationExamples.length) {
        nextSimulationButton.textContent = "View Results";
    }
}

phishingButton.addEventListener("click", () => {
    checkSimulation("phishing");
});

legitimateButton.addEventListener("click", () => {
    checkSimulation("legitimate");
});

nextSimulationButton.addEventListener("click", () => {
    if (!simulationAnswered) {
        simulationFeedback.textContent = "Please answer this example first.";
        return;
    }

    if (simulationCompleted >= simulationExamples.length) {
        simulationMessage.textContent =
            `Training completed! Your score: ${simulationScore}/${simulationExamples.length}.`;
        simulationFeedback.textContent =
            "Press Restart to practice again.";
        phishingButton.disabled = true;
        legitimateButton.disabled = true;
        nextSimulationButton.disabled = true;
        return;
    }

    simulationIndex++;
    showSimulation();

    if (simulationCompleted < simulationExamples.length) {
        nextSimulationButton.textContent = "Next Example";
    }
});

document.getElementById("resetSimulation").addEventListener("click", () => {
    simulationIndex = 0;
    simulationAnswered = false;
    simulationScore = 0;
    simulationCompleted = 0;
    nextSimulationButton.textContent = "Next Example";
    showSimulation();
});

showSimulation();
