document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.dataset.target;

            // 移除所有标签的激活状态
            tabs.forEach(t => t.classList.remove('active'));
            // 移除所有内容的显示状态
            tabContents.forEach(content => content.style.display = 'none');

            // 激活当前标签
            this.classList.add('active');
            // 显示对应的内容
            document.getElementById(target).style.display = 'block';
        });
    });
});