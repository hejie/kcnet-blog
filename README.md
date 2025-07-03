一个专注于多模态大模型和人工智能技术的个人博客，采用极简主义设计风格，内容优先的用户体验。

## ✨ 特性

  - 🎨 **极简主义设计** - 采用深色主题，清晰的视觉层次。
  - 📱 **响应式布局** - 完美适配桌面端和移动端。
  - ⚡ **高性能** - 通过 Tailwind CSS 构建，最终只包含用到的样式，文件体积小，加载速度快。
  - 🎯 **内容优先** - 专注于阅读体验，减少干扰。
  - 🔧 **易于维护** - 简单的文件结构，易于更新内容。
  - 🐳 **Docker部署** - 完整的容器化部署方案。

## 🛠️ 技术栈

  - **前端**: HTML5, CSS3, JavaScript (ES6+)
  - **样式框架**: Tailwind CSS (通过 PostCSS 构建)
  - **开发环境**: Node.js
  - **Web服务器**: Nginx
  - **容器化**: Docker & Docker Compose

## 🚀 本地开发与部署指南

本指南将引导你完成从环境配置到项目部署的完整流程。

### 第1步：环境准备 (Prerequisites)

在开始之前，请确保你的系统 (如 Ubuntu) 已安装 `git`。然后，你需要安装一个稳定版本的 Node.js 和 npm。

1.  **克隆项目**

    ```bash
    git clone https://github.com/your-username/kcnet-blog.git
    cd kcnet-blog
    ```

2.  **安装 Node.js (推荐)**
    如果你的 `npm` 或 `npx` 命令遇到问题，强烈建议从 NodeSource 安装一个最新的长期支持版 (LTS)。这能从根源上避免很多环境问题。

    ```bash
    # (可选，但推荐) 卸载系统自带的旧版本
    sudo apt-get purge nodejs npm -y
    sudo apt-get autoremove -y

    # 从 NodeSource 安装 Node.js v20.x LTS
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```

### 第2步：安装项目依赖

使用 `npm` 安装项目所需的所有开发工具，如 `tailwindcss`, `postcss` 等。

```bash
npm install
```

### 第3步：配置与构建

1.  **初始化 Tailwind CSS**
    如果项目是首次配置，运行此命令来生成 `tailwind.config.js` 和 `postcss.config.js` 配置文件。

    ```bash
    npx tailwindcss init -p
    ```

2.  **配置 Tailwind 扫描路径**
    编辑 `tailwind.config.js` 文件，在 `content` 数组中指定你的 HTML 文件路径，以便 Tailwind 能找到所有用到的样式类。

    ```javascript
    content: ["./dist/**/*.{html,js}"],
    ```

3.  **构建 CSS**
    运行 `build` 命令。它会读取 `src/input.css`，扫描 `dist/` 目录下的文件，并生成一个经过压缩优化的最终 CSS 文件到 `dist/assets/css/style.css`。

    ```bash
    npm run build
    ```

    **重要提示**: 每次修改了 HTML 文件中的样式类后，都需要重新运行此命令来更新 CSS 文件。

### 第4步：Docker 部署

项目已配置为通过 Docker 部署。

1.  **构建并启动容器**
    此命令会在后台构建 Docker 镜像并启动 Nginx 服务。

    ```bash
    docker compose up -d
    ```

2.  **查看日志**
    你可以使用此命令来监控服务的运行日志。

    ```bash
    docker compose logs -f
    ```

## 🤝 贡献与代码管理

为了保持仓库的整洁，请遵循以下 Git 工作流程。

1.  **配置 .gitignore**
    确保 `.gitignore` 文件包含了需要被忽略的目录和文件。这可以防止将自动生成的或敏感的文件提交到仓库。

    ```
    # Node.js 依赖包 (自动生成)
    /node_modules

    # 构建产物 (自动生成)
    /dist/assets/css/style.css

    # Docker & SSL
    /letsencrypt
    ```

2.  **提交更改的标准流程**
    在进行更改（例如，修改了 HTML 或添加了新功能）后，请遵循以下步骤提交。

    ```bash
    # 1. (如果需要) 重新构建你的 CSS 文件
    npm run build

    # 2. 将所有应该追踪的文件添加到暂存区
    # Git 会根据 .gitignore 自动忽略不必要的文件
    git add .

    # 3. 提交你的更改，并附上一条清晰的说明
    git commit -m "feat: 添加了新的页面并更新样式"

    # 4. 将提交推送到远程仓库
    git push
    ```

## 📄 许可证

本项目采用 MIT 许可证 - 查看 `LICENSE` 文件了解详情。

## 📞 联系方式

  - **GitHub**: [@kcnet](https://github.com/hejie)
  - **Email**: kc.cn.com@gmail.com

-----

⭐ 如果这个项目对你有帮助，请给它一个星标！
