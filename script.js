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
                case 'home':
                    filePath = 'home/index.html';
                    break;
                case 'about':
                    filePath = 'about/index.html';
                    break;
                case 'tags':
                    filePath = 'tags/index.html';
                    break;
            }

            fetch(filePath)
              .then(response => response.text())
              .then(data => {
                    contentContainer.innerHTML = data;
                });
        });
    });
});