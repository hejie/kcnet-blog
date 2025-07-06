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

### acme.sh 安装与使用完整命令指南

**目标**：使用 `acme.sh` 通过 Cloudflare 的 DNS API，为您的域名申请一张通配符证书，并将其安装到指定目录，同时配置好全自动续签。

#### 前提

  * 您已经拥有一个 Cloudflare 账户和一个域名。
  * 您已经按照之前的步骤，在 Cloudflare 上创建了一个有 `DNS:Edit` 权限的 API 令牌（Token）。
  * 您以一个普通用户（例如 `ubuntu`）通过 SSH 登录到您的服务器。

-----

### 第 1 步：安装 acme.sh

执行官方安装命令，将 `your_email@example.com` 替换为您自己的真实邮箱。

```bash
curl https://get.acme.sh | sh -s email=your_email@example.com
```

  * **作用**：下载并安装 `acme.sh` 到您当前用户的主目录下 (`/home/ubuntu/.acme.sh/`)，并自动创建一个用于续签的定时任务。

-----

### 第 2 步：配置 Cloudflare API 凭证

执行 `export` 命令，将【您的Cloudflare API令牌】替换为您保存的真实令牌字符串。

```bash
export CF_Token="【您的Cloudflare API令牌】"
```

  * **作用**：在当前终端会话中设置环境变量，让 `acme.sh` 知道如何登录 Cloudflare。
  * **注意**：此命令仅在当前窗口有效，关闭后会失效。但 `acme.sh` 在成功执行一次后，会将凭证加密保存在其配置文件中，供将来自动续签使用。

-----

### 第 3 步：设置默认证书颁发机构（CA）

为了避免遇到速率限制或默认 CA 的问题，建议明确指定使用 Let's Encrypt。

```bash
默认是ZeroSSL
/home/ubuntu/.acme.sh/acme.sh --set-default-ca --server zerossl
也可以转换到letsencrypt
/home/ubuntu/.acme.sh/acme.sh --set-default-ca --server letsencrypt
```

-----

### 第 4 步：签发证书

使用 `acme.sh` 的完整路径来执行签发命令。将 `your_domain.com` 替换为您自己的域名。

```bash
/home/ubuntu/.acme.sh/acme.sh --issue --dns dns_cf -d your_domain.com -d '*.your_domain.com' --ecc
```

  * **`--issue`**: 签发操作。
  * **`--dns dns_cf`**: 指定使用 Cloudflare DNS 进行验证。
  * **`-d your_domain.com`**: 为主域名申请。
  * **`-d '*.your_domain.com'`**: 为所有子域名申请通配符证书。
  * **`--ecc`**: 申请 ECC 证书（性能更好），如果不需要可以去掉。

-----

### 第 5 步：安装证书到指定目录（核心步骤）

这是将证书部署到应用（如 Xray）并配置自动化的关键一步。

```bash
# 1. 创建用于存放证书的目录 (如果还没创建)
sudo mkdir -p /etc/app/certs

# 2. 执行安装命令
新建文件
vim /home/ubuntu/app/reload_services.sh
文件内容
#!/bin/bash
# 3. 重启 kcnet-blog 项目的 web 服务
echo "Reloading kcnet-blog..."
docker compose -f /home/ubuntu/app/kcnet-blog/docker-compose.yml restart web
# 4. 如果还有其他项目，继续在下面添加
# echo "Reloading project-three..."
# docker compose -f /path/to/project-three/docker-compose.yml restart service-name
echo "All services reloaded."

#将用户添加到docker组，需重新连接SSH会话生效
sudo usermod -aG docker ubuntu 

# 5. 安装
sudo /home/ubuntu/.acme.sh/acme.sh --install-cert -d your_domain.com --ecc \
--key-file       /etc/app/certs/private.key  \
--fullchain-file /etc/app/certs/certificate.crt \
--reloadcmd      "/home/ubuntu/app/reload_services.sh"
```

  * **`sudo /home/ubuntu/.acme.sh/acme.sh`**: 使用 `sudo` 配合完整路径，解决权限问题。
  * **`--install-cert -d your_domain.com`**: 指定为哪个域名安装证书。
  * **`--key-file` 和 `--fullchain-file`**: 指定证书私钥和公钥的最终存放路径。
  * **`--reloadcmd "..."`**: **自动化核心**。在未来每次自动续签成功后，`acme.sh` 都会自动执行这条命令，来重启您的服务以加载新证书。请确保 `docker-compose.yml` 的路径是正确的。

-----

### 第 6 步：(可选，为方便) 添加别名

如果您觉得每次都输入完整路径很麻烦，可以执行以下命令，为 `acme.sh` 创建一个快捷方式。

```bash
echo 'alias acme.sh=/home/ubuntu/.acme.sh/acme.sh' >> ~/.bashrc && source ~/.bashrc
```

执行后，您就可以在任何地方直接使用 `acme.sh` 命令了。

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
    sudo docker compose down --volumes
    sudo docker system prune -af
    sudo docker compose up --build -d
    ```

2.  **查看日志**
    你可以使用此命令来监控服务的运行日志。

    ```bash
    docker compose logs -f
    ```

## 📞 联系方式

  - **GitHub**: [@kcnet](https://github.com/hejie)
  - **Email**: kc.cn.com@gmail.com

-----

⭐ 如果这个项目对你有帮助，请给它一个星标！
