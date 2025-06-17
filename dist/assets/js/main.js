// 图片加载完成后添加 loaded 类
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[loading]');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    });
});

// 移动端菜单切换
function toggleMobileMenu() {
    const aside = document.querySelector('aside');
    aside.classList.toggle('active');
}

// 暗色模式切换
function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    html.classList.toggle('dark');
    localStorage.setItem('darkMode', !isDark);
}

// 初始化暗色模式
const darkMode = localStorage.getItem('darkMode');
if (darkMode === 'false') {
    document.documentElement.classList.remove('dark');
}
