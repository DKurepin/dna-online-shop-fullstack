
let calcScrollValue = () => {
    let scrollProgress = document.getElementById("progress");
    let progressValue = document.getElementById("progressValue");
    let position = document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrollValue = Math.round(position * 100 / height);

    if (position > 100) {
        scrollProgress.style.display = "grid";
    }
    else {
        scrollProgress.style.display = "none";
    }
    scrollProgress.addEventListener("click", () => {
        document.documentElement.scrollTop = 0;
    });
    scrollProgress.style.background = `conic-gradient(#ccff32 ${scrollValue}%, #EC9192 ${scrollValue}%)`;
}


window.onscroll = calcScrollValue;
window.onload = calcScrollValue;