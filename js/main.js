document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainScreen = document.getElementById('main-screen');
    const enterBtn = document.getElementById('enter-btn');
    const shareBtn = document.getElementById('share-btn');

    // 进入主页面
    enterBtn.addEventListener('click', () => {
        welcomeScreen.style.display = 'none';
        mainScreen.style.display = 'block';
        initParticles();
        initAudio();
    });

    // 分享功能
    shareBtn.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: '生日快乐！',
                text: '查看这个超棒的生日祝福！',
                url: window.location.href
            });
        } else {
            alert('您的浏览器不支持分享功能');
        }
    });
}); 