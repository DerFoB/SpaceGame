export function showRestartPopup(message) {
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