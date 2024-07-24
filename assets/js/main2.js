document.addEventListener("DOMContentLoaded", function () {
    const logo = document.getElementById("logo");
    const circles = document.querySelectorAll(".circle");
    const dots = document.querySelectorAll(".dot");

    // Start the entrance animation
    logo.style.animationName = 'fadeInLeft';
    
    // Animate circles
    circles.forEach((circle, index) => {
        setTimeout(() => {
            circle.style.animationName = 'rotateIn';
        }, index * 500); // Delay each circle's animation start time
    });

    // Animate dots with different timings
    dots.forEach((dot, index) => {
        setTimeout(() => {
            dot.style.animationName = 'dotAnimation';
        }, index * 300); // Delay each dot's animation start time
    });

    // Set a timeout to trigger the exit animation after the entrance is complete
    setTimeout(() => {
        logo.style.animationName = 'fadeOutRight';
    }, 6000); // 6 seconds for the entrance animation to complete
});
setTimeout(function() {
    window.location.href = "music.html";
}, 5300);