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

            // 加载对应的内容
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
                            fetch(mdPath)
                              .then(response => {
                                    if (!response.ok) {
                                        throw new Error(`加载 MD 文件失败，状态码: ${response.status}，路径: ${mdPath}`);
                                    }
                                    return response.text();
                                })
                              .then(mdContent => {
                                    const htmlContent = marked.parse(mdContent);
                                    contentContainer.innerHTML = htmlContent;
                                })
                              .catch(error => {
                                    console.error('加载 MD 文件时出错:', error);
                                    alert(`加载 MD 文件失败，请检查文件路径: ${mdPath}`);
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