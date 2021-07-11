Write = {
    template: `
        <div class="stretch100 flex_column write">
            <div class="flex1 g_scroll_y">
                <div class="g_con1200 write_content">
                    <p v-for="item in 100">{{item}}</p>
                </div>
            </div>
            <div class="bottom">
                <div class="g_con1200 submit">
                    <el-button type="primary" size="medium">提交日志</el-button>
                </div>
            </div>
        </div>
    `
}