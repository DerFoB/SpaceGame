document.addEventListener("DOMContentLoaded", () => {
    fetch("html/instructions.html")
        .then(response => response.text())
        .then(html => {
            document.getElementById("instructions-container").innerHTML = html;
        })
        .catch(error => console.error("Error loading instructions:", error));
});