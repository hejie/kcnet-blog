// 页面路由配置
const routes = {
    '/': 'content/home.html',
    '/about': 'content/about.html',
    '/tags': 'content/tags.html'
};

// 加载页面内容
async function loadContent(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error('Page not found');
        const content = await response.text();
        document.getElementById('main-content').innerHTML = content;
        
        // 更新活动导航项
        updateActiveNav(path);
        
        // 更新浏览器历史
        const currentPath = Object.keys(routes).find(key => routes[key] === path);
        if (currentPath) {
            history.pushState({ path }, '', currentPath === '/' ? 'index.html' : currentPath.slice(1) + '.html');
        }
    } catch (error) {
        console.error('Error loading page:', error);
        document.getElementById('main-content').innerHTML = '<div class="text-center text-red-500">加载失败，请稍后重试</div>';
    }
}

// 更新导航栏活动状态
function updateActiveNav(currentPath) {
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
        const linkPath = link.getAttribute('data-path');
        if (routes[linkPath] === currentPath) {
            link.classList.add('bg-gray-800', 'text-green-400');
            link.classList.remove('hover:bg-gray-800', 'hover:text-green-400');
        } else {
            link.classList.remove('bg-gray-800', 'text-green-400');
            link.classList.add('hover:bg-gray-800', 'hover:text-green-400');
        }
    });
}

// 移动端菜单切换
function toggleMobileMenu() {
    const aside = document.querySelector('aside');
    aside.classList.toggle('active');
}

// 图片加载处理
function handleImageLoad() {
    const images = document.querySelectorAll('img[loading]');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => img.classList.add('loaded'));
        }
    });
}

// 暗色模式切换
function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    html.classList.toggle('dark');
    localStorage.setItem('darkMode', !isDark);
}

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    // 创建内容目录
    const mainContentDir = 'content';
    
    // 设置导航链接点击事件
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const path = link.getAttribute('data-path');
            if (routes[path]) {
                loadContent(routes[path]);
            }
        });
    });

    // 处理浏览器前进/后退
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.path) {
            loadContent(event.state.path);
        }
    });

    // 初始化暗色模式
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'false') {
        document.documentElement.classList.remove('dark');
    }

    // 处理图片加载
    handleImageLoad();

    // 加载初始页面
    const currentPath = window.location.pathname;
    const defaultPath = routes['/'];
    loadContent(defaultPath);
});
