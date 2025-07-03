document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');

    // 路由表现在是所有可访问页面的权威来源
    const routes = {
        '/': 'content/home.html',
        '/about': 'content/about.html',
        '/tags': 'content/tags.html',
        '/posts/neural-network-basics': 'posts/neural-network-basics.html'
        // 注意：/posts/multimodal-ai 等链接未在此处注册
    };

    const loadContent = async (path) => {
        const contentUrl = routes[path];

        // 这个检查现在主要用于处理直接访问无效URL的情况
        if (!contentUrl) {
            window.location.href = '/404.html';
            return;
        }

        try {
            mainContent.classList.remove('loaded');
            await new Promise(resolve => setTimeout(resolve, 200));

            const response = await fetch(contentUrl);
            if (!response.ok) throw new Error('Network response was not ok.');
            
            const content = await response.text();
            mainContent.innerHTML = content;
            updateActiveNav(path);

        } catch (error) {
            console.error('Failed to load content:', error);
            mainContent.innerHTML = `<p class="text-red-400 text-center">加载内容失败，请刷新页面重试。</p>`;
        } finally {
            mainContent.classList.add('loaded');
        }
    };

    const updateActiveNav = (path) => {
        document.querySelectorAll('nav a').forEach(link => {
            if (link.getAttribute('data-path') === path) {
                link.classList.add('bg-slate-800/50', 'text-white');
            } else {
                link.classList.remove('bg-slate-800/50', 'text-white');
            }
        });
    };
    
    const router = () => {
        let currentPath = window.location.pathname;
        if (currentPath.length > 1 && currentPath.endsWith('/')) {
            currentPath = currentPath.slice(0, -1);
        }
        if (currentPath === '/404') return;
        loadContent(currentPath || '/');
    };

    // 优化后的、统一的点击事件处理器
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a');

        // 1. 确保点击的是一个有效的、同域下的链接
        if (!link || link.hostname !== window.location.hostname) {
            return;
        }

        // 2. 立即阻止浏览器的默认跳转行为
        e.preventDefault();

        const path = link.pathname.replace(/\/$/, '') || '/';
        
        // 如果点击的不是当前页面
        if (path !== window.location.pathname) {
            // 3. 检查链接是否在我们的路由表中
            if (routes[path]) {
                // 3a. 如果是有效链接，则执行SPA的无刷新跳转
                history.pushState({path}, '', path);
                loadContent(path);
            } else {
                // 3b. 如果是无效链接，则直接一步跳转到404页面
                window.location.href = '/404.html';
            }
        }
    });

    // 处理浏览器前进/后退
    window.addEventListener('popstate', (e) => {
        router();
    });

    // 初始页面加载
    router();
});
