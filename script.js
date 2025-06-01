document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const contentContainer = document.getElementById('content-container');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.dataset.target;

            // 移除所有标签的激活状态
            tabs.forEach(t => t.classList.remove('active'));
            // 激活当前标签
            this.classList.add('active');

            // 加载标签页对应的内容
            let filePath = '';
            switch(target) {
                case 'Home':
                    filePath = 'Home/index.html';
                    break;
                case 'About':
                    filePath = 'About/index.html';
                    break;
                case 'Tags':
                    filePath = 'Tags/index.html';
                    break;
            }

            fetch(filePath)
              .then(response => {
                    if (!response.ok) {
                        throw new Error(`网络响应失败，状态码: ${response.status}`);
                    }
                    return response.text();
                })
              .then(data => {
                    contentContainer.innerHTML = data;
                    // 为 md 文件链接添加点击事件
                    const mdLinks = contentContainer.querySelectorAll('a[href$=".md"]');
                    mdLinks.forEach(link => {
                        link.addEventListener('click', function(e) {
                            e.preventDefault();
                            const mdPath = this.getAttribute('href');
                            // 动态拼接完整路径
                            const fullMdPath = new URL(mdPath, window.location.href).href;
                            fetch(fullMdPath)
                              .then(response => {
                                    if (!response.ok) {
                                        throw new Error(`加载 MD 文件失败，状态码: ${response.status}，路径: ${fullMdPath}`);
                                    }
                                    return response.text();
                                })
                              .then(mdContent => {
                                    if (typeof marked === 'undefined') {
                                        console.error('marked 库未正确加载');
                                        alert('marked 库未正确加载，请检查 index.html 文件');
                                        return;
                                    }
                                    const htmlContent = marked.parse(mdContent);
                                    contentContainer.innerHTML = htmlContent;
                                })
                              .catch(error => {
                                    console.error('加载 MD 文件时出错:', error);
                                    alert(`加载 MD 文件失败，请检查文件路径: ${fullMdPath}`);
                                });
                        });
                    });
                    // 为 HTML 文件链接添加点击事件
                    const htmlLinks = contentContainer.querySelectorAll('a[href$=".html"]');
                    htmlLinks.forEach(link => {
                        link.addEventListener('click', function(e) {
                            e.preventDefault();
                            const htmlPath = this.getAttribute('href');
                            // 动态拼接完整路径，使用 href 属性获取完整 URL
                            const fullHtmlPath = new URL(htmlPath, window.location.href).href;
                            fetch(fullHtmlPath)
                              .then(response => {
                                    if (!response.ok) {
                                        throw new Error(`加载 HTML 文件失败，状态码: ${response.status}，路径: ${fullHtmlPath}`);
                                    }
                                    return response.text();
                                })
                              .then(htmlContent => {
                                    contentContainer.innerHTML = htmlContent;
                                    // 重新绑定 md 和 html 链接的点击事件
                                    const newMdLinks = contentContainer.querySelectorAll('a[href$=".md"]');
                                    newMdLinks.forEach(newLink => {
                                        newLink.addEventListener('click', function(e) {
                                            e.preventDefault();
                                            const newMdPath = this.getAttribute('href');
                                            const newFullMdPath = new URL(newMdPath, window.location.href).href;
                                            fetch(newFullMdPath)
                                              .then(response => {
                                                    if (!response.ok) {
                                                        throw new Error(`加载 MD 文件失败，状态码: ${response.status}，路径: ${newFullMdPath}`);
                                                    }
                                                    return response.text();
                                                })
                                              .then(newMdContent => {
                                                    if (typeof marked === 'undefined') {
                                                        console.error('marked 库未正确加载');
                                                        alert('marked 库未正确加载，请检查 index.html 文件');
                                                        return;
                                                    }
                                                    const newHtmlContent = marked.parse(newMdContent);
                                                    contentContainer.innerHTML = newHtmlContent;
                                                })
                                              .catch(error => {
                                                    console.error('加载 MD 文件时出错:', error);
                                                    alert(`加载 MD 文件失败，请检查文件路径: ${newFullMdPath}`);
                                                });
                                        });
                                    });
                                    const newHtmlLinks = contentContainer.querySelectorAll('a[href$=".html"]');
                                    newHtmlLinks.forEach(newLink => {
                                        newLink.addEventListener('click', function(e) {
                                            e.preventDefault();
                                            const newHtmlPath = this.getAttribute('href');
                                            const newFullHtmlPath = new URL(newHtmlPath, window.location.href).href;
                                            fetch(newFullHtmlPath)
                                              .then(response => {
                                                    if (!response.ok) {
                                                        throw new Error(`加载 HTML 文件失败，状态码: ${response.status}，路径: ${newFullHtmlPath}`);
                                                    }
                                                    return response.text();
                                                })
                                              .then(newHtmlContent => {
                                                    contentContainer.innerHTML = newHtmlContent;
                                                })
                                              .catch(error => {
                                                    console.error('加载 HTML 文件时出错:', error);
                                                    alert(`加载 HTML 文件失败，请检查文件路径: ${newFullHtmlPath}`);
                                                });
                                        });
                                    });
                                })
                              .catch(error => {
                                    console.error('加载 HTML 文件时出错:', error);
                                    alert(`加载 HTML 文件失败，请检查文件路径: ${fullHtmlPath}`);
                                });
                        });
                    });
                })
              .catch(error => {
                    console.error('加载页面时出错:', error);
                    alert(`加载页面失败，请检查文件路径: ${filePath}`);
                });
        });
    });

    searchButton.addEventListener('click', function() {
        const keyword = searchInput.value.toLowerCase();
        const allElements = contentContainer.getElementsByTagName('*');
        
        for (let i = 0; i < allElements.length; i++) {
            const element = allElements[i];
            if (element.textContent) {
                const text = element.textContent.toLowerCase();
                if (text.includes(keyword)) {
                    element.style.backgroundColor = 'yellow';
                } else {
                    element.style.backgroundColor = '';
                }
            }
        }
    });
});