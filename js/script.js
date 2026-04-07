const questions = [
    {
        question: "Hvilket klippene er riktig måte å koble seg til nettet?",
        answers: ["Klipp 1", "Klipp 2", "Klipp 3", "Ingen av dem"],
        correct: 0,
        embed: "https://drive.google.com/file/d/159pK47cnHpPJhpwnUNavPq-AstVIO68z/preview"
    },
    {
        question: "Hva måles i Ohm (Ω)?",
        answers: ["Strøm", "Motstand", "Spenning", "Effekt"],
        correct: 1
    },
    {
        question: "Hva måler makspuls?",
        answers: ["Maks antall hjerteslag per minutt", "Maks oksygenopptak", "Maks muskelstyrke", "Maks blodtrykk"],
        correct: 0
    },
    {
        question: "Hva er en storyboard?",
        answers: ["En liste over skuespillere", "En plan med tegninger av scener i en film", "En kameratype", "Et redigeringsprogram"],
        correct: 1
    },
    {
        question: "Hva er en hypotese?",
        answers: ["Et endelig svar", "En testbar antakelse", "En teori", "En konklusjon"],
        correct: 1
    },
    {
        question: "Hva er mersalg?",
        answers: ["Å gi rabatt", "Å selge flere produkter til kunden", "Å avslutte salg", "Å sende varer"],
        correct: 1
    },
    {
        question: "Hva er en CNC-maskin?",
        answers: ["Manuell maskin", "Datastyrt maskin for produksjon", "Håndverktøy", "Sveiseapparat"],
        correct: 1
    },
    {
        question: "Hva er en algoritme?",
        answers: ["En type datamaskin", "En steg-for-steg løsning på et problem", "En nettside", "En database"],
        correct: 1
    },
    {
        question: "Hvem er Norges konge?",
        answers: ["Harald V", "Olav V", "Haakon VII", "Frederik X"],
        correct: 0
    },
    {
        question: "Hva er hovedstaden i Norge?",
        answers: ["Bergen", "Oslo", "Trondheim", "Stavanger"],
        correct: 1
    },
    {
        question: "Hvilket språk brukes for styling av nettsider?",
        answers: ["HTML", "CSS", "Python", "Java"],
        correct: 1
    }
];

const SCOREBOARD_KEY = "quizScoreboard";

let currentQuestion = 0;
let selectedAnswer = null;
let score = 0;
let hasAnswered = false;

const statusEl = document.getElementById("status");
const mediaEl = document.getElementById("media");
const questionEl = document.getElementById("sporsmal");
const answersEl = document.getElementById("valg");
const nextBtn = document.getElementById("neste");
const restartBtn = document.getElementById("start-pa-nytt");
const messageEl = document.getElementById("melding");
const nameEl = document.getElementById("navn");
const saveBtn = document.getElementById("lagre-score");
const saveBoxEl = document.getElementById("lagring");
const scoreboardEl = document.getElementById("toppliste");
const scoreListEl = document.getElementById("liste");

if (
    statusEl &&
    mediaEl &&
    questionEl &&
    answersEl &&
    nextBtn &&
    restartBtn &&
    messageEl &&
    nameEl &&
    saveBtn &&
    saveBoxEl &&
    scoreboardEl &&
    scoreListEl
) {
    function getScoreboard() {
        const savedScores = localStorage.getItem(SCOREBOARD_KEY);
        return savedScores ? JSON.parse(savedScores) : [];
    }

    function saveScoreboard(scores) {
        localStorage.setItem(SCOREBOARD_KEY, JSON.stringify(scores));
    }

    function showScoreboard() {
        const scores = getScoreboard();
        scoreListEl.innerHTML = "";

        if (scores.length === 0) {
            const item = document.createElement("li");
            item.textContent = "Ingen score lagret ennå.";
            scoreListEl.appendChild(item);
            return;
        }

        scores.forEach((entry) => {
            const item = document.createElement("li");
            item.textContent = `${entry.name}: ${entry.score} av ${questions.length}`;
            scoreListEl.appendChild(item);
        });
    }

    function showQuestion() {
        const current = questions[currentQuestion];
        statusEl.textContent = `Spørsmål ${currentQuestion + 1} av ${questions.length}`;
        questionEl.textContent = current.question;
        messageEl.textContent = "";
        nextBtn.disabled = true;
        nextBtn.style.display = "inline-block";
        restartBtn.style.display = "none";
        saveBoxEl.style.display = "none";
        scoreboardEl.style.display = "none";
        selectedAnswer = null;
        hasAnswered = false;

        if (current.embed) {
            mediaEl.innerHTML = `<iframe src="${current.embed}" allow="autoplay"></iframe>`;
            mediaEl.style.display = "block";
        } else {
            mediaEl.innerHTML = "";
            mediaEl.style.display = "none";
        }

        answersEl.innerHTML = "";

        current.answers.forEach((answer, index) => {
            const button = document.createElement("button");
            button.textContent = answer;

            button.addEventListener("click", () => {
                if (hasAnswered) {
                    return;
                }

                selectedAnswer = index;
                hasAnswered = true;
                nextBtn.disabled = false;

                const allButtons = answersEl.querySelectorAll("button");
                allButtons.forEach((btn, buttonIndex) => {
                    btn.disabled = true;

                    if (buttonIndex === current.correct) {
                        btn.classList.add("correct");
                    }
                });

                if (index === current.correct) {
                    button.classList.add("selected");
                    messageEl.textContent = "Riktig svar!";
                } else {
                    button.classList.add("wrong");
                    messageEl.textContent = `Feil svar. Riktig svar er ${current.answers[current.correct]}.`;
                }
            });

            answersEl.appendChild(button);
        });
    }

    function showResult() {
        statusEl.textContent = "Ferdig!";
        mediaEl.innerHTML = "";
        mediaEl.style.display = "none";
        questionEl.textContent = "Quizen er ferdig.";
        answersEl.innerHTML = "";
        nextBtn.style.display = "none";
        restartBtn.style.display = "inline-block";
        saveBoxEl.style.display = "block";
        scoreboardEl.style.display = "block";
        messageEl.textContent = `Du fikk ${score} av ${questions.length} poeng.`;
        showScoreboard();
    }

    function restartQuiz() {
        currentQuestion = 0;
        selectedAnswer = null;
        score = 0;
        hasAnswered = false;
        nameEl.value = "";
        showQuestion();
    }

    function saveCurrentScore() {
        const name = nameEl.value.trim() || "Ukjent spiller";
        const scores = getScoreboard();

        scores.push({ name, score });
        scores.sort((a, b) => b.score - a.score);

        saveScoreboard(scores);
        showScoreboard();
        nameEl.value = "";
        messageEl.textContent = `Du fikk ${score} av ${questions.length} poeng. Scoren er lagret.`;
    }

    nextBtn.addEventListener("click", () => {
        if (selectedAnswer === null) {
            return;
        }

        if (selectedAnswer === questions[currentQuestion].correct) {
            score++;
        }

        currentQuestion++;

        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    });

    restartBtn.addEventListener("click", restartQuiz);
    saveBtn.addEventListener("click", saveCurrentScore);

    showQuestion();
}
