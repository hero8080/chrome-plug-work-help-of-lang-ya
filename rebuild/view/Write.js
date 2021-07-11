Write = {
    template: `
        <div class="flex1">
            <div class="flex_column stretch100 g_bg_bgcolor">
                <div class="flex1 g_scroll_y empty_content_box">
                    <div class="empty_content">
                        <div v-for="item in 100">{{item}}</div>
                    </div>
                </div>
                <div class="empty_content_bottom">
                    <div>提交日志</div>
                </div>
            </div>  
        </div>
    `
}