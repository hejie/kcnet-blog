// 页面路由配置
const routes = {
    '/': 'content/home.html',
    '/about': 'content/about.html',
    '/tags': 'content/tags.html'
};

// 加载页面内容
async function loadContent(contentPath, routePath) {
    try {
        const mainContent = document.getElementById('main-content');
        
        // 开始淡出动画
        mainContent.classList.remove('loaded');
        await new Promise(resolve => setTimeout(resolve, 150));
        
        // 预加载新内容
        const response = await fetch(contentPath);
        if (!response.ok) throw new Error('Page not found');
        const content = await response.text();
        
        // 应用新内容
        mainContent.style.opacity = '0';
        await new Promise(resolve => setTimeout(resolve, 50));
        mainContent.innerHTML = content;
        
        // 强制重排完成后开始淡入
        void mainContent.offsetHeight;
        requestAnimationFrame(() => {
            mainContent.classList.add('loaded');
            mainContent.style.opacity = '';
            
            // 更新活动导航项
            updateActiveNav(contentPath);
            
            // 更新浏览器URL（不触发页面刷新）
            if (routePath) {
                history.pushState({ contentPath }, '', routePath);
            }
        });
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

// 获取当前路径对应的内容路径
function getCurrentContentPath() {
    const path = window.location.pathname || '/';
    // 移除开头的域名部分，只保留路径
    const cleanPath = path.replace(/^https?:\/\/[^\/]+/, '');
    // 如果路径以 .html 结尾，去掉 .html
    const routePath = cleanPath.replace(/\.html$/, '') || '/';
    return routes[routePath] || routes['/'];
}

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    // 设置导航链接点击事件
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const path = link.getAttribute('data-path');
            if (routes[path]) {
                const routePath = path === '/' ? '/' : path + '.html';
                loadContent(routes[path], routePath);
            }
        });
    });

    // 处理浏览器前进/后退
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.contentPath) {
            loadContent(event.state.contentPath);
        } else {
            loadContent(getCurrentContentPath());
        }
    });

    // 初始化暗色模式
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'false') {
        document.documentElement.classList.remove('dark');
    }    // 获取当前页面路径
    const currentContentPath = getCurrentContentPath();
    
    // 避免重复加载，只有在主内容区为空时才加载
    const mainContent = document.getElementById('main-content');
    if (!mainContent.children.length) {
        loadContent(currentContentPath);
    }

    // 处理图片加载
    handleImageLoad();
});
