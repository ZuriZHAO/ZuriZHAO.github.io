document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const contentContainer = document.getElementById('content-container');

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
              .then(response => response.text())
              .then(data => {
                    contentContainer.innerHTML = data;
                    // 为 md 文件链接添加点击事件
                    const mdLinks = contentContainer.querySelectorAll('a[href$=".md"]');
                    mdLinks.forEach(link => {
                        link.addEventListener('click', function(e) {
                            e.preventDefault();
                            const mdPath = this.getAttribute('href');
                            fetch(mdPath)
                              .then(response => response.text())
                              .then(mdContent => {
                                    const htmlContent = marked.parse(mdContent);
                                    contentContainer.innerHTML = htmlContent;
                                });
                        });
                    });
                });
        });
    });
});