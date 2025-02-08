export function endGamePopup(score){
    setTimeout(() => {
            let highscorePlayer;
        
            if (localStorage.getItem("highscore") !== null) {
                highscorePlayer = JSON.parse(localStorage.getItem("highscore"));
            } else {
                highscorePlayer = { name: "unknown", score: -99 };
            }
        
            let modal = document.getElementById("gameModal");
            let modalTitle = document.getElementById("modalTitle");
            let modalMessage = document.getElementById("modalMessage");
            let inputField = document.getElementById("playerNameInput");
            let modalButton = document.getElementById("modalButton");
            let overlay = document.getElementById("overlay");
    
            overlay.style.display = "block"; // blur background
        
            // if new highscore
            if (score > highscorePlayer.score) {
                modalTitle.innerText = "New Highscore!";
                modalMessage.innerText = `Your highscore is: ${score}\nEnter your name:`;
                inputField.style.display = "block"; // show input
                modalButton.innerText = "Save";
        
                modal.style.display = "block"; // show Popup
        
                modalButton.onclick = function () {
                    let playerName = inputField.value.trim() || "unknown";
        
                    // save highscore
                    highscorePlayer.name = playerName;
                    highscorePlayer.score = score;
                    localStorage.setItem("highscore", JSON.stringify(highscorePlayer));
        
                    showRestartPopup(`New Highscore!!!\nYour highscore: ${score} by ${playerName}`);
                };
            } else {
                showRestartPopup(`Your score: ${score}\nLocal highscore: ${highscorePlayer.score} by ${highscorePlayer.name}`);
            }
        }, 200);
}

function showRestartPopup(message) {
    let modal = document.getElementById("gameModal");
    let modalTitle = document.getElementById("modalTitle");
    let modalMessage = document.getElementById("modalMessage");
    let inputField = document.getElementById("playerNameInput");
    let modalButton = document.getElementById("modalButton");

    modalTitle.innerText = "Game Over";
    modalMessage.innerText = message + "\nDo you want to restart?";
    inputField.style.display = "none";
    modalButton.innerText = "Restart";

    modal.style.display = "block";

    modalButton.onclick = function () {
        modal.style.display = "none";
        location.reload();
    };
}