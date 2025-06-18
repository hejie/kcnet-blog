document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.querySelector('main');
    let sidebarElement = null; // 用来存放侧边栏元素，确保只创建一次
    let contentElement = null; // 用来存放内容区元素

    const routes = {
        '/': '/content/home.html',
        '/about': '/content/about.html',
        '/tags': '/content/tags.html'
    };

    // 1. 初始化页面布局的函数
    function initLayout() {
        // 创建侧边栏的 HTML 结构
        const sidebarHTML = `
            <aside class="md:w-1/3 md:shrink-0 md:sticky md:top-8 self-start mb-8 md:mb-0">
                <div class="text-center md:text-left">
                    <img class="w-24 h-24 rounded-full mx-auto md:mx-0" src="/assets/images/avatar.png" alt="博主头像">
                    <h1 class="text-3xl font-bold mt-4">kcnet</h1>
                    <p class="mt-2 text-gray-600 dark:text-gray-400">专注于多模态大模型</p>
                </div>
                <nav class="mt-8">
                    <ul class="space-y-2" id="nav-links">
                        <li><a href="/" class="nav-link" data-path="/">首页</a></li>
                        <li><a href="/about" class="nav-link" data-path="/about">关于</a></li>
                        <li><a href="/tags" class="nav-link" data-path="/tags">标签</a></li>
                    </ul>
                </nav>
                <div class="mt-8 flex items-center justify-center md:justify-start">
                    <a href="https://github.com/your-github-username" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-accent">
                        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.65.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.745 0 .267.18.577.688.48A10.003 10.003 0 0022 12c0-5.523-4.477-10-10-10z" clip-rule="evenodd"></path>
                        </svg>
                    </a>
                </div>
            </aside>
        `;

        // 创建内容区的容器
        const contentContainerHTML = `<div class="md:w-2/3 md:flex-1" id="content-area"></div>`;

        // 清空主容器并插入布局
        mainContainer.innerHTML = sidebarHTML + contentContainerHTML;
        
        // 保存对侧边栏和内容区元素的引用
        sidebarElement = mainContainer.querySelector('aside');
        contentElement = mainContainer.querySelector('#content-area');
    }

    // 2. 加载并显示页面内容的函数
    async function loadContent(path) {
        const contentPath = routes[path] || '/content/404.html';
        
        try {
            const response = await fetch(contentPath);
            if (!response.ok) throw new Error('Content not found');
            const html = await response.text();
            contentElement.innerHTML = html; // 只更新内容区域
            updateActiveLink(path);
        } catch (error) {
            console.error('Failed to load content:', error);
            // 可以加载一个错误提示页面
            const errorResponse = await fetch('/404.html');
            contentElement.innerHTML = await errorResponse.text();
        }
    }

    // 3. 更新导航链接高亮状态的函数
    function updateActiveLink(path) {
        document.querySelectorAll('#nav-links a').forEach(link => {
            if (link.dataset.path === path) {
                link.classList.add('active'); // 'active' 是你在 style.css 中定义的选中样式类
            } else {
                link.classList.remove('active');
            }
        });
    }

    // 4. 路由处理的主函数
    function handleRouteChange() {
        const path = window.location.pathname;
        loadContent(path);
    }

    // 5. 拦截页面内的链接点击
    mainContainer.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-path]');
        if (link) {
            e.preventDefault(); // 阻止浏览器默认的页面跳转
            const path = link.dataset.path;
            if (path !== window.location.pathname) {
                history.pushState({}, '', path); // 更新地址栏 URL
                handleRouteChange(); // 手动处理路由变化
            }
        }
    });

    // 6. 监听浏览器的前进/后退事件
    window.addEventListener('popstate', handleRouteChange);

    // 7. 应用初始化
    initLayout(); // 初始化布局，只会执行一次！
    handleRouteChange(); // 根据当前 URL 加载初始内容
});