import { PAGE_CONFIG } from './config.js';

document.addEventListener('DOMContentLoaded', async function() {
    const tabs = document.querySelectorAll('.tab');
    const contentContainer = document.getElementById('content-container');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResultsDropdown = document.getElementById('search-results-dropdown'); 

    // 预加载所有页面内容
    const allPages = PAGE_CONFIG;
    const allContents = {};

    async function preloadPages() {
        for (const page of allPages) {
            try {
                const response = await fetch(page);
                if (!response.ok) {
                    throw new Error(`网络响应失败，状态码: ${response.status}`);
                }
                const data = await response.text();
                allContents[page] = data;

                // 处理 MD 文件链接
                const mdLinks = data.match(/<a[^>]+href="([^">]+?\.md)"[^>]*>/g);
                if (mdLinks) {
                    for (const link of mdLinks) {
                        const mdPath = link.match(/"([^">]+?\.md)"/)[1];
                        const fullMdPath = new URL(mdPath, window.location.href).href;
                        try {
                            const mdResponse = await fetch(fullMdPath);
                            if (!mdResponse.ok) {
                                throw new Error(`加载 MD 文件失败，状态码: ${mdResponse.status}，路径: ${fullMdPath}`);
                            }
                            const mdContent = await mdResponse.text();
                            if (typeof marked === 'undefined') {
                                console.error('marked 库未正确加载');
                                alert('marked 库未正确加载，请检查 index.html 文件');
                            } else {
                                const htmlContent = marked.parse(mdContent);
                                allContents[fullMdPath] = htmlContent;
                            }
                        } catch (error) {
                            console.error('加载 MD 文件时出错:', error);
                            alert(`加载 MD 文件失败，请检查文件路径: ${fullMdPath}`);
                        }
                    }
                }
            } catch (error) {
                console.error('加载页面时出错:', error);
                alert(`加载页面失败，请检查文件路径: ${page}`);
            }
        }
    }

    await preloadPages();

    // 监听浏览器的回退和前进事件
    window.addEventListener('popstate', function(event) {
        if (event.state) {
            const filePath = event.state.filePath;
            fetch(filePath)
              .then(response => {
                    if (!response.ok) {
                        throw new Error(`网络响应失败，状态码: ${response.status}`);
                    }
                    return response.text();
                })
              .then(data => {
                    contentContainer.innerHTML = data;
                    // 重新绑定 md 和 html 链接的点击事件
                    const mdLinks = contentContainer.querySelectorAll('a[href$=".md"]');
                    mdLinks.forEach(link => {
                        link.addEventListener('click', function(e) {
                            e.preventDefault();
                            const mdPath = this.getAttribute('href');
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
                                    // 添加新的历史记录
                                    window.history.pushState({ filePath: fullMdPath }, '', fullMdPath);
                                })
                              .catch(error => {
                                    console.error('加载 MD 文件时出错:', error);
                                    alert(`加载 MD 文件失败，请检查文件路径: ${fullMdPath}`);
                                });
                        });
                    });
                    const htmlLinks = contentContainer.querySelectorAll('a[href$=".html"]');
                    htmlLinks.forEach(link => {
                        link.addEventListener('click', function(e) {
                            e.preventDefault();
                            const htmlPath = this.getAttribute('href');
                            const baseUrl = new URL(filePath, window.location.href);
                            const fullHtmlPath = new URL(htmlPath, baseUrl).href;
                            fetch(fullHtmlPath)
                              .then(response => {
                                    if (!response.ok) {
                                        throw new Error(`加载 HTML 文件失败，状态码: ${response.status}，路径: ${fullHtmlPath}`);
                                    }
                                    return response.text();
                                })
                              .then(htmlContent => {
                                    contentContainer.innerHTML = htmlContent;
                                    // 添加新的历史记录
                                    window.history.pushState({ filePath: fullHtmlPath }, '', fullHtmlPath);
                                    // 重新绑定 md 和 html 链接的点击事件
                                    const newMdLinks = contentContainer.querySelectorAll('a[href$=".md"]');
                                    newMdLinks.forEach(newLink => {
                                        newLink.addEventListener('click', function(e) {
                                            e.preventDefault();
                                            const newMdPath = this.getAttribute('href');
                                            const newBaseUrl = new URL(fullHtmlPath, window.location.href);
                                            const newFullMdPath = new URL(newMdPath, newBaseUrl).href;
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
                                                    // 添加新的历史记录
                                                    window.history.pushState({ filePath: newFullMdPath }, '', newFullMdPath);
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
                                            const newBaseUrl = new URL(fullHtmlPath, window.location.href);
                                            const newFullHtmlPath = new URL(newHtmlPath, newBaseUrl).href;
                                            fetch(newFullHtmlPath)
                                              .then(response => {
                                                    if (!response.ok) {
                                                        throw new Error(`加载 HTML 文件失败，状态码: ${response.status}，路径: ${newFullHtmlPath}`);
                                                    }
                                                    return response.text();
                                                })
                                              .then(newHtmlContent => {
                                                    contentContainer.innerHTML = newHtmlContent;
                                                    // 添加新的历史记录
                                                    window.history.pushState({ filePath: newFullHtmlPath }, '', newFullHtmlPath);
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
        }
    });

    // 找到 Home 标签并模拟点击
    const homeTab = Array.from(tabs).find(tab => tab.dataset.target === 'Home');
    if (homeTab) {
        homeTab.click();
    }

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
                    // 添加新的历史记录
                    window.history.pushState({ filePath: filePath }, '', filePath);
                    // 为 md 文件链接添加点击事件
                    const mdLinks = contentContainer.querySelectorAll('a[href$=".md"]');
                    mdLinks.forEach(link => {
                        link.addEventListener('click', function(e) {
                            e.preventDefault();
                            const mdPath = this.getAttribute('href');
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
                                    // 添加新的历史记录
                                    window.history.pushState({ filePath: fullMdPath }, '', fullMdPath);
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
                            const baseUrl = new URL(filePath, window.location.href);
                            const fullHtmlPath = new URL(htmlPath, baseUrl).href;
                            fetch(fullHtmlPath)
                              .then(response => {
                                    if (!response.ok) {
                                        throw new Error(`加载 HTML 文件失败，状态码: ${response.status}，路径: ${fullHtmlPath}`);
                                    }
                                    return response.text();
                                })
                              .then(htmlContent => {
                                    contentContainer.innerHTML = htmlContent;
                                    // 添加新的历史记录
                                    window.history.pushState({ filePath: fullHtmlPath }, '', fullHtmlPath);
                                    // 重新绑定 md 和 html 链接的点击事件
                                    const newMdLinks = contentContainer.querySelectorAll('a[href$=".md"]');
                                    newMdLinks.forEach(newLink => {
                                        newLink.addEventListener('click', function(e) {
                                            e.preventDefault();
                                            const newMdPath = this.getAttribute('href');
                                            const newBaseUrl = new URL(fullHtmlPath, window.location.href);
                                            const newFullMdPath = new URL(newMdPath, newBaseUrl).href;
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
                                                    // 添加新的历史记录
                                                    window.history.pushState({ filePath: newFullMdPath }, '', newFullMdPath);
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
                                            const newBaseUrl = new URL(fullHtmlPath, window.location.href);
                                            const newFullHtmlPath = new URL(newHtmlPath, newBaseUrl).href;
                                            fetch(newFullHtmlPath)
                                              .then(response => {
                                                    if (!response.ok) {
                                                        throw new Error(`加载 HTML 文件失败，状态码: ${response.status}，路径: ${newFullHtmlPath}`);
                                                    }
                                                    return response.text();
                                                })
                                              .then(newHtmlContent => {
                                                    contentContainer.innerHTML = newHtmlContent;
                                                    // 添加新的历史记录
                                                    window.history.pushState({ filePath: newFullHtmlPath }, '', newFullHtmlPath);
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

    // 原有的搜索按钮点击事件
    searchButton.addEventListener('click', performSearch);

    // 添加键盘事件监听，当按下 Enter 键时执行搜索
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    function performSearch() {
        const keyword = searchInput.value.toLowerCase();
        const searchResults = [];

        // 遍历所有预加载的内容
        for (const page in allContents) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = allContents[page];
            const allElements = tempDiv.getElementsByTagName('*');

            for (let i = 0; i < allElements.length; i++) {
                const element = allElements[i];
                if (element.textContent) {
                    const text = element.textContent.toLowerCase();
                    if (text.includes(keyword)) {
                        searchResults.push({ element, page });
                    }
                }
            }
        }

        // 清空下拉栏
        searchResultsDropdown.innerHTML = '';

        if (searchResults.length > 0) {
            // 将搜索结果显示在下拉栏中
            searchResults.forEach(({ element, page }) => {
                const resultItem = document.createElement('div');
                resultItem.textContent = `${page}: ${element.textContent}`;
                searchResultsDropdown.appendChild(resultItem);
            });
        } else {
            // 若搜索不到，在搜索框显示提示信息
            searchInput.placeholder = 'No result';
        }
    }
});