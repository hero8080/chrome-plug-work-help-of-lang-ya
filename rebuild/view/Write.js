Write = {
    template: `
        <div class="flex1 flex_column write">
            <div class="empty_height"></div>
            <div class="empty_content_bottom g_pad40t g_pad12b g_h24 g_pad60l bold">写日志</div> 
            <div class="middle">
                <div class="g_pad20tb content">
                    <el-form class="form" :rules="rules" label-position="top" :model="form" ref="form">
                      <el-form-item label="名称" prop="name">
                        <el-input v-model="form.name"></el-input>
                      </el-form-item>
                      <el-form-item label="活动区域">
                        <el-input v-model="form.desc"></el-input>
                      </el-form-item>
                      <el-form-item label="活动形式">
                        <el-input v-model="form.name"></el-input>
                      </el-form-item>
                    </el-form>
                </div>
            </div> 
            <div class="flex1 empty_content_bottom g_pad32t g_pad28bt g_pad60l">
                <el-button class="el_btn_beautiful" type="success" @click="submitForm">成功按钮</el-button>
                <el-button class="el_btn_beautiful el_btn_beautiful_cancel" plain>朴素按钮</el-button>
            </div> 
            <div class="empty_height_bottom"></div>
        </div> 
    `,
    data(){
        return {
            projectList:[],
            form:{
                name:'',
                desc:'',
            },
            rules: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
            }
        };
    },
    computed:{
      ...Vuex.mapState(['_isGetData','_userInfo','_leftMenuTree'])
    },
    watch:{
        _isGetData(data){
            data&&this.getProject()
        }
    },
    created(){
        if(this._isGetData){
            this.getProject()
        }
    },
    methods:{
        getProject(){
            let columns=[]
            let projectList=[]
            let pageTotal=0
            let times=0
            let getListData=(isFirst=true,current=1)=>{
                getProject({
                    workflowid: this._leftMenuTree[0].childs[0].key,
                    wfid: this._leftMenuTree[0].childs[0].key,
                    f_weaver_belongto_userid: this._userInfo.userid,
                    wfCreater: this._userInfo.userid,
                    current: current,
                    min: (current-1)*10+1,
                    max: current*10,
                }).then(res=>{
                    times++
                    if(!columns){
                        columns=res.columns
                    }
                    projectList=projectList.concat(res.datas)
                    if(isFirst){
                        pageTotal=Math.ceil(res.total/res.pageSize)
                        for(let i=2;i<=pageTotal;i++){
                            getListData(false,i)
                        }
                    }
                    if(times==pageTotal){
                        console.log('current:'+times)
                        console.log('pageTotal'+pageTotal)
                        //宣告数据以获取完成
                        this.projectList=projectList.sort(function (a,b){
                            return parseInt(b.id)-parseInt(a.id)
                        })
                        console.log(this.projectList)
                        // write()
                    }
                })
            }
            getListData()
        },
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    }
}