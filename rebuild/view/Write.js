Write = {
    template: `
        <div class="flex1 flex_column write">
            <div class="empty_height"></div>
            <div class="empty_content_bottom g_pad40t g_pad12b g_h24 g_pad60l bold">写日志</div> 
            <div class="middle">
                <div class="g_pad20tb content">
                    <el-form class="form" :rules="rules" label-position="top" :model="form" ref="form">
                      <el-form-item label="日报名称" prop="requestname">
                        <el-input v-model="form.requestname" placeholder="请输入日报名称"></el-input>
                      </el-form-item>
                      <el-form-item label="日报日期" prop="field7673">
                        <el-input v-model="form.field7673" placeholder="请输入日报日期"></el-input>
                      </el-form-item>
                      <div class="g_h18 bold g_mar20t g_pad12b form_fieldset">今日工作</div>
                      <div>
                      <div class="flex pro_list g_mar20t">
                        <div class="g_img flex_content_center g_wid120_ah icon_add_box g_pointer" @click="addProject">
                            <div>
                                <div class="g_wid40_ah icon_add block_center"></div>
                                <p class="g_h14 g_mar4t g_text2_color">添加项目</p>
                            </div>
                        </div>
                        <div class="flex1">
                            
                        </div>
                      </div>
                      </div>
                      <div class="g_h18 bold g_mar20t g_pad12b form_fieldset">明日计划</div>
                      <div>
                      明日计划
                      </div>
                    </el-form>
                    <div class="g_wid20_h"></div>
                </div>
            </div> 
            <div class="flex1 empty_content_bottom g_pad32t g_pad28bt g_pad60l">
                <el-button class="el_btn_beautiful" type="success" @click="submitForm">成功按钮</el-button>
                <el-button class="el_btn_beautiful el_btn_beautiful_cancel" plain>朴素按钮</el-button>
            </div> 
            <div class="empty_height_bottom"></div>
            <model v-model:isOpen="selectProject" modelClass="model_select_project flex">
                <div class="left g_pad20lr">
                    <div class="title g_pad40tb g_h18">选择项目</div>
                    <div class="g_mar12b_s">
                        <p v-for="(item,index) in projectType" class="g_pad12tb g_h14 g_pad16l g_pointer" :class="{project_select:index==projectSelectIndex}" @click="projectSelectIndex=index">{{item}}</p>
                    </div>
                </div>
                <div class="flex1 flex_column right">
<!--                    <div class="g_wid20_h"></div>-->
                    <div class="g_h18 select_title flex_center">
                        <p class="flex1 g_text_color">{{projectType[projectSelectIndex]}}</p>
                        <div 
                        class="g_mar8r g_wid30_ah svg_icon g_main_color g_pointer"
                        :class="isBlocViewkModel?'svg_icon_list':'svg_icon_block'" 
                        @click="isBlocViewkModel=!isBlocViewkModel"></div>
                    </div>
                    <div class="flex1 g_scroll_y">
                        <div class="g_col_4_16 g_mar16b_s g_scroll_width" v-if="isBlocViewkModel">
                            <div v-for="item in projectSelecData" class="g_pad20 pro_list">
                                <div class="g_img g_radius_all g_wid60_ah g_form_bgselect_bgactive_bgcolor block_center">
                                
                                </div>
                                <p class="text_center g_pad20t desc">{{item.xmmk}}</p>
<!--                            {{item}}-->
<!--                            <p>负责人:{{item.}}</p>-->
                            </div>
                        </div>
                        <div class="g_col_3_16 g_mar16b_s g_scroll_width" v-else>
                            <div v-for="item in projectSelecData" class="g_pad20 pro_list flex_center">
                                <div class="g_img g_radius_all g_wid60_ah g_form_bgselect_bgactive_bgcolor">
                                
                                </div>
                                <div class="flex1 g_pad12l">
                                    <p class="bold">{{item.xmmk}}</p>
                                    <div class="label g_pad8t">
                                        <span class="purple" :title="'负责人<'+item.xm+'>'">{{item.xm}}</span>
                                        <span class="blue" :title="'提报人<'+item.tbr+'>'">{{item.tbr}}</span>
                                        <span :title="'所属分类<'+item.xmfl+'>'">{{item.xmfl}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="text_center g_mar40tb">
                        <el-button class="el_btn_beautiful" type="success" @click="submitForm">下一步</el-button>
                    </div>
                </div>
            </model>
        </div> 
    `,
    data(){
        return {
            selectProject:false,
            projectList:[],
            projectType:[],
            projectSelectIndex:0,
            isBlocViewkModel:true,
            form:{
                requestname:'工作日报与计划-周章锋-2021-07-16',
                field7673:'2021-07-16',
            },
            rules: {
                requestname: [
                    { required: true, message: '请输入日报名称', trigger: 'blur' }
                ],
                field7673: [
                    { required: true, message: '请输入日报日期', trigger: 'blur' }
                ],
            },
        };
    },
    computed:{
        ...Vuex.mapState(['_isGetData','_userInfo','_leftMenuTree']),
        projectSelecData(){
            let projectType=this.projectType[this.projectSelectIndex]
            let projectSelectIndex=this.projectSelectIndex
            return this.projectList.filter((item,index)=>projectSelectIndex==0?true:item.xmmc==projectType)
        }
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
        clearHtmlTag(str){
            return str.replace(/<\/?.+?\/?>/g,'').replace(/&nbsp;/ig,'')
        },
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
                        //宣告数据已获取完成
                        this.projectList=projectList.sort(function (a,b){
                            return parseInt(b.id)-parseInt(a.id)
                        }).map(item=>{
                            item.tbr=this.clearHtmlTag(item.tbr)
                            item.xm=this.clearHtmlTag(item.xm)
                            return item
                        })
                        console.log(this.projectList)
                        let projectType=this.projectList.map(item=>{
                            return item.xmmc
                        }).filter((item,index,data)=>data.indexOf(item)==index)
                        projectType.unshift('全部项目')
                        this.projectType=projectType
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
        addProject(){
            this.selectProject=true
        }
    }
}