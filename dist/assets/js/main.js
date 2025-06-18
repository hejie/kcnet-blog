// 页面路由配置
const routes = {
    '/': 'content/home.html',
    '/about': 'content/about.html',
    '/tags': 'content/tags.html',
    '/posts/neural-network-basics': 'posts/neural-network-basics.html'
};

// 加载页面内容
async function loadContent(contentPath, routePath) {
    try {
        const mainContent = document.getElementById('main-content');
        
        // 开始淡出动画
        mainContent.classList.remove('loaded');
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // 预加载新内容
        const response = await fetch(contentPath);
        if (!response.ok) throw new Error('Page not found');
        const content = await response.text();
        
        // 应用新内容
        mainContent.style.opacity = '0';
        await new Promise(resolve => setTimeout(resolve, 100));
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
        document.getElementById('main-content').innerHTML = `
            <div class="text-center py-12">
                <div class="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                </div>
                <h2 class="text-xl font-semibold text-white mb-2">加载失败</h2>
                <p class="text-slate-400">请稍后重试</p>
            </div>
        `;
    }
}

// 更新导航栏活动状态
function updateActiveNav(currentPath) {
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
        const linkPath = link.getAttribute('data-path');
        if (routes[linkPath] === currentPath) {
            // 移除所有活动状态
            link.classList.remove('bg-slate-800/50', 'text-white', 'border-blue-500/50');
            // 添加活动状态
            link.classList.add('bg-slate-800/50', 'text-white', 'border-blue-500/50');
        } else {
            // 移除活动状态
            link.classList.remove('bg-slate-800/50', 'text-white', 'border-blue-500/50');
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

// 添加页面加载动画
function addPageAnimations() {
    const elements = document.querySelectorAll('.animate-fade-in-up');
    elements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });
}

// 处理文章链接点击
function handleArticleLinks() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && link.href.includes('/posts/')) {
            e.preventDefault();
            const path = link.pathname;
            if (routes[path]) {
                loadContent(routes[path], path);
            }
        }
    });
}

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    // 设置导航链接点击事件
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const path = link.getAttribute('data-path');
            if (routes[path]) {
                const routePath = path === '/' ? '/' : path;
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
    }

    // 获取当前页面路径
    const currentContentPath = getCurrentContentPath();
    
    // 避免重复加载，只有在主内容区为空时才加载
    const mainContent = document.getElementById('main-content');
    if (!mainContent.children.length) {
        loadContent(currentContentPath);
    }

    // 处理图片加载
    handleImageLoad();

    // 添加页面动画
    addPageAnimations();

    // 处理文章链接
    handleArticleLinks();

    // 添加滚动监听，实现视差效果
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.parallax');
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });

    // 添加键盘导航支持
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // ESC键关闭移动端菜单
            const aside = document.querySelector('aside');
            if (aside.classList.contains('active')) {
                aside.classList.remove('active');
            }
        }
    });

    // 添加触摸手势支持（移动端）
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // 向左滑动 - 可以用于导航到下一页
                console.log('Swiped left');
            } else {
                // 向右滑动 - 可以用于导航到上一页
                console.log('Swiped right');
            }
        }
    }
});
