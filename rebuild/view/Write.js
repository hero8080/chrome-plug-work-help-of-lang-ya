Write = {
    template: `
        <div class="flex1 flex_column write">
            <div class="empty_height"></div>
            <div class="empty_content_bottom g_pad40t g_pad12b g_h24 g_pad60l bold">写日志</div> 
            <!--表单-->
            <div class="middle" ref="middle">
                <div class="g_pad20tb content">
                    <el-form class="form" :rules="rules" label-position="top" :model="form" ref="form">
                          <el-form-item label="日报名称" prop="requestname">
                            <el-input v-model="form.requestname" placeholder="请输入日报名称"></el-input>
                          </el-form-item>
                          <el-form-item label="日报日期" prop="field7673">
                            <el-input v-model="form.field7673" placeholder="请输入日报日期"></el-input>
                          </el-form-item>
                          <div class="g_h18 bold g_mar40t g_pad12b form_fieldset">今日工作</div>
                          <div>
                              <!--项目列表-->
                              <div v-for="(item,index) in form.projectList" class="g_pad16t">
                                   <fieldset>
                                   <legend class="g_h14 g_desc_color">项目{{index+1}}-{{item.xmmk}}</legend>
                                   <div class="g_pad20b g_pad4t form_pro_list flex_center">
                                       <div class="g_img g_radius4 g_wid50_ah">
                                        <img :src="item.img" alt="">
                                        </div>
                                        <div class="flex1 g_pad12l">
                                            <p class="bold">{{item.xmmk}}</p>
                                            <div class="label g_pad8t">
                                                <span class="purple" :title="'负责人<'+item.xm+'>'">{{item.xm}}</span>
                                                <span class="blue" :title="'提报人<'+item.tbr+'>'">{{item.tbr}}</span>
                                                <span :title="'所属分类<'+item.xmfl+'>'">{{item.xmfl}}</span>
                                            </div>
                                        </div>
                                        <div class="svg_icon svg_icon_more_menu g_pointer">
                                            <div class="empty"></div>
                                            <div class="select_pro_menu g_transition g_h14 g_pad8_s g_pad16l_s g_pad8tb">
                                                <p class="g_transition g_pointer" @click="changeProject(index)">切换项目</p>
                                                <p class="g_transition g_pointer" @click="deletPro(form.projectList,index)">删除项目</p>
                                                <p class="g_transition g_pointer" @click="addDesc(item)">{{item.isShowDesc?'移除':'添加'}}备注</p>
                                            </div>
                                        </div>
                                      </div>
                                      <div class="slider">
                                            <div class="flex_center g_pad20t g_h14 g_cancel_color">
                                                <p class="flex1">完成度</p>
                                                <p>{{item.field7693}}%</p>
                                            </div>
                                            <el-form-item 
                                                :key="item.key"
                                                :prop="'projectList.' + index + '.field7693'"
                                              >
                                            <el-slider :step="2" v-model="item.field7693"></el-slider>
                                            </el-form-item>
                                      </div>
                                       <div class="slider">
                                            <div class="flex_center g_h14 g_cancel_color">
                                                <p class="flex1">工时</p>
                                                <p>{{item.field7694}}小时</p>
                                            </div>
                                            <el-form-item 
                                                :key="item.key"
                                                :prop="'projectList.' + index + '.field7694'"
                                              >
                                            <el-slider :step="1" show-stops v-model="item.field7694" :max="12"></el-slider>
                                            </el-form-item>
                                      </div>
                                      <div class="g_pad20b g_pad12t">
                                          <el-form-item :key="item.key" :prop="'projectList.' + index + '.field7692'">
                                            <el-radio-group v-model="item.field7692">
                                              <el-radio :label="0">计划内</el-radio>
                                              <el-radio :label="2">计划外</el-radio>
                                            </el-radio-group>
                                          </el-form-item>
                                      </div>
                                      <el-form-item 
                                        :key="item.key"
                                        :prop="'projectList.' + index + '.field7691'"
                                        :rules="{
                                          required: true, message: '日志内容不能为空', trigger: 'blur'
                                        }"
                                      >
                                        <el-input class="textarea" type="textarea" v-model="item.field7691" placeholder="写点啥"></el-input>
                                      </el-form-item>
                                      <div class="g_pad24t" v-if="item.isShowDesc">
                                          <el-form-item 
                                            :key="item.key"
                                            :prop="'projectList.' + index + '.field7695'"
                                          >
                                            <el-input class="textarea" type="textarea" v-model="item.field7695" placeholder="请填写备注"></el-input>
                                          </el-form-item>
                                      </div>
                                      <div class="g_pad12t"></div>
                                   </fieldset>
                              </div>
                              <div class="g_mar20t">                     
                                <div class="flex_center g_pad32l g_h14 g_pad12tb g_main_color icon_add_box g_pointer g_transition" @click="addProject"> +添加项目</div>
                              </div>
                          </div>
                          <div class="g_mar40t g_pad12b form_fieldset flex_center">
                                <p class="flex1 bold g_h18">明日计划</p>
                                <div class="svg_icon svg_icon_more_menu g_pointer">
                                    <div class="empty"></div>
                                    <div class="select_pro_menu g_transition g_h14 g_pad8_s g_pad16l_s g_pad8tb">
                                        <p class="g_transition g_pointer" @click="tomorrowPlain.isShowHelpData=!tomorrowPlain.isShowHelpData;form.field7697_1=''">{{tomorrowPlain.isShowHelpData?'移除':'添加'}}需协助内容</p>
                                        <p class="g_transition g_pointer" @click="tomorrowPlain.isShowRemarkData=!tomorrowPlain.isShowRemarkData;form.field7698_1=''">{{tomorrowPlain.isShowRemarkData?'移除':'添加'}}备注</p>
                                    </div>
                                </div>
                          </div>
                          <el-form-item
                            label="工作内容"
                            prop="field7696_1"
                          >
                            <el-input class="textarea" type="textarea" v-model="form.field7696_1" placeholder="写点啥"></el-input>
                          </el-form-item>
                          <el-form-item
                            v-if="tomorrowPlain.isShowHelpData"
                            label="需协助内容"
                            prop="field7697_1"
                          >
                            <el-input class="textarea" type="textarea" v-model="form.field7697_1" placeholder="写点啥"></el-input>
                          </el-form-item>
                          <el-form-item
                            v-if="tomorrowPlain.isShowRemarkData"
                            label="备注"
                            prop="field7698_1"
                          >
                            <el-input class="textarea" type="textarea" v-model="form.field7698_1" placeholder="请填写备注"></el-input>
                          </el-form-item>
                    </el-form>
                    <div class="g_wid20_h"></div>
                </div>
            </div> 
            <div class="flex1 empty_content_bottom g_pad32t g_pad28bt g_pad60l">
                <el-button class="el_btn_beautiful" @click="submitForm">
                    <loading v-if="submitFormLoaidng" size="8" space="2" color="fff"></loading>
                    <template v-else>
                        提交日志
                    </template>
                </el-button>
<!--                <el-button class="el_btn_beautiful el_btn_beautiful_cancel" plain>取消</el-button>-->
            </div> 
            <div class="empty_height_bottom"></div>
            <!--选择项目弹窗-->
            <model v-model:isOpen="selectProject" modelClass="model_select_project flex">
                <div class="left g_pad20lr">
                    <div class="title g_pad40tb g_h18">{{isChangePro?'切换':'选择'}}项目</div>
                    <div class="g_mar12b_s">
                        <p v-for="(item,index) in projectType" class="g_pad12tb g_h14 g_pad16l g_pointer" :class="{project_select:index==projectSelectIndex}" @click="projectSelectIndex=index">{{item}}</p>
                    </div>
                </div>
                <div class="flex1 flex_column right">
<!--                    <div class="g_wid20_h"></div>-->
                    <div class="select_title flex_center">
                        <div class="flex1 g_text_color">
                            <p class="g_h18">{{projectType[projectSelectIndex]}}</p>
                            <p class="g_h14 g_pad8t g_text2_color" v-if="!isChangePro">按住ctrl键可多选项目</p>
                        </div>
                        <el-input class="search_input" v-model="searchWord" placeholder="请输入项目名称/拼音/首字母"></el-input>
                        <div 
                        class="g_mar8r g_wid30_ah svg_icon g_text2_bgcolor g_pointer"
                        :class="isBlocViewkModel?'svg_icon_list':'svg_icon_block'" 
                        @click="isBlocViewkModel=!isBlocViewkModel"></div>
                    </div>
                    <div class="flex1 g_scroll_y">
                        <loading v-if="projectListLoading"></loading>
                        <div class="g_col_4_16 g_mar16b_s g_scroll_width" v-if="isBlocViewkModel">
                            <div v-for="item in projectSelecData" class="g_pad20 pro_list g_pointer g_radius4"
                            :class="{project_user_select:item.isSelect}" @click="projectSelect($event,item)"
                            >
                                <div class="g_img g_radius4 g_wid60_ah block_center">
                                    <img :src="item.img" alt="">
                                </div>
                                <p class="text_center g_pad20t desc">{{item.xmmk}}</p>
<!--                            {{item}}-->
<!--                            <p>负责人:{{item.}}</p>-->
                            </div>
                        </div>
                        <div class="g_col_3_16 g_mar16b_s g_scroll_width" v-else>
                            <div v-for="item in projectSelecData" class="g_pad24 pro_list flex_center g_pointer g_radius4"
                            :class="{project_user_select:item.isSelect}" @click="projectSelect($event,item)"
                            >
                                <div class="g_img g_radius4 g_wid50_ah">
                                    <img :src="item.img" alt="">
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
                    <div class="text_center g_mar40b g_pad20t">
                        <el-button class="el_btn_beautiful" @click="selectProjectNext">{{isChangePro?'确认切换项目':'下一步'}}{{searchWord}}</el-button>
                    </div>
                </div>
            </model>
        </div> 
    `,
    data() {
        return {
            selectProject: false,
            isChangePro:false,
            isChangeProIndex:0,
            projectList: [],
            projectType: [],
            projectSelectIndex: 0,
            projectUserSelect: null,
            isBlocViewkModel: true,
            projectListLoading:true,
            searchWord:'',
            form: {
                requestname: '',
                field7673: '',
                projectList: [],
                field7696_1:'',
                field7697_1:'',
                field7698_1:'',
            },
            tomorrowPlain:{
              isShowHelpData:false,
              isShowRemarkData:false,
            },
            rules: {
                requestname: [
                    {required: true, message: '请输入日报名称', trigger: 'blur'}
                ],
                field7673: [
                    {required: true, message: '请输入日报日期', trigger: 'blur'}
                ],
                field7696_1: [
                    {required: true, message: '请输入工作内容', trigger: 'blur'}
                ]
            },
            submitFormLoaidng:false
        };
    },
    computed: {
        ...Vuex.mapState(['_isGetData', '_userInfo', '_leftMenuTree']),
        projectSelecData() {
            let projectType = this.projectType[this.projectSelectIndex]
            let projectSelectIndex = this.projectSelectIndex
            let projectListFilter=this.projectList.filter((item, index) => projectSelectIndex == 0 ? true : item.xmmc == projectType)
            let searchWord=this.searchWord
            if(searchWord){
                let _RegExp=new RegExp(searchWord,'ig')
                return projectListFilter.filter(item=>item.xmmk.search(_RegExp)!==-1||item.easyName.search(_RegExp)!==-1||item.fullName.search(_RegExp)!==-1)
            }
            return projectListFilter
        }
    },
    watch: {
        _isGetData(data) {
            data && this.getProject()
        }
    },
    created() {
        if (this._isGetData) {
            this.getProject()
        }
        this.initFormData()
    },
    methods: {
        getDate(){
            let date=new Date()
            let add0=(num,prefix='')=>{
                return num<10?prefix+'0'+num:prefix+num
            }
            return add0(date.getFullYear())+add0(date.getMonth()+1,'-')+add0(date.getDate(),'-')
        },
        initFormData(){
            let date=this.getDate()
            this.form.requestname=`工作日报与计划-${this._userInfo.username}-${date}`
            this.form.field7673=date
        },
        clearHtmlTag(str) {
            return str.replace(/<\/?.+?\/?>/g, '').replace(/&nbsp;/ig, '')
        },
        getProject() {
            let columns = []
            let projectList = []
            let pageTotal = 0
            let times = 0
            let getListData = (isFirst = true, current = 1) => {
                getProject({
                    workflowid: this._leftMenuTree[0].childs[0].key,
                    wfid: this._leftMenuTree[0].childs[0].key,
                    f_weaver_belongto_userid: this._userInfo.userid,
                    wfCreater: this._userInfo.userid,
                    current: current,
                    min: (current - 1) * 10 + 1,
                    max: current * 10,
                }).then(res => {
                    times++
                    if (!columns) {
                        columns = res.columns
                    }
                    projectList = projectList.concat(res.datas)
                    if (isFirst) {
                        pageTotal = Math.ceil(res.total / res.pageSize)
                        for (let i = 2; i <= pageTotal; i++) {
                            getListData(false, i)
                        }
                    }
                    if (times == pageTotal) {
                        console.log('current:' + times)
                        console.log('pageTotal' + pageTotal)
                        //宣告数据已获取完成
                        this.projectList = projectList.sort(function (a, b) {
                            return parseInt(b.id) - parseInt(a.id)
                        }).map(item => {
                            item.tbr = this.clearHtmlTag(item.tbr)
                            item.xm = this.clearHtmlTag(item.xm)
                            item.img= chrome.extension.getURL('pro_icon/'+item.id+'.png')
                            item.fullName = pinyin.getFullChars(item.xmmk);
                            item.easyName = pinyin.getCamelChars(item.xmmk);
                            return item
                        })
                        this.projectListLoading=false
                        console.log(this.projectList)
                        let projectType = this.projectList.map(item => {
                            return item.xmmc
                        }).filter((item, index, data) => data.indexOf(item) == index)
                        projectType.unshift('全部项目')
                        this.projectType = projectType
                        // write()
                    }
                })
            }
            getListData()
        },
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let projectList=[...this.form.projectList]
                    if(!projectList.length){
                        this.$message('啊哦,巧了,尚未检查到您添加的项目!')
                        return
                    }
                    let subMitData={
                        "requestname": this.form.requestname,
                        "field7673": this.form.field7673,

                        "field7696_1": this.form.field7696_1,
                        "field7697_1": this.form.field7697_1,
                        "field7698_1": this.form.field7698_1,
                    }
                    projectList.map((item,index)=>{
                        let keys=[
                            "field11407",
                            "field11406",
                            "field11406_name",
                            "field7691",
                            "field7692",
                            "field7693",
                            "field7694",
                            "field7695",
                            "field7705"
                        ]
                        for(let key in item){
                            if(keys.indexOf(key)==-1){
                                continue
                            }
                            let _key=''
                            if(key.search(/_name/ig)!==-1){
                                //有name
                                _key=key.replace(/_name/i,'_'+index+'nmae')
                            }else{
                                //无name
                                _key=key+'_'+index
                            }
                            subMitData[_key]=item[key]
                        }
                    })
                    let workflowid=Number(this._leftMenuTree[0].childs[0].key)
                    let userId=Number(this._userInfo.userid)
                    let param={
                        ...subMitData,
                        "workflowid": workflowid,
                        "lastloginuserid": userId,
                        "f_weaver_belongto_userid": userId,
                        "field7670": userId,
                        "20064_123_addrequest_submit_token": new Date().getTime(),
                        "linkageUUID": creatUuid(),
                    }
                    // console.log(param)
                    loadFrom().then(_form=>{
                        param.signatureSecretKey=_form.params.signatureSecretKey
                        param.signatureAttributesStr=_form.params.signatureAttributesStr
                        write(param,'submitFormLoaidng',this).then(res=>{
                            if(res.data.type=='SUCCESS'){
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                })
                                this.$refs.form.resetFields()
                                this.form.projectList=[]
                                this.initFormData()
                            }else{
                                this.$message({
                                    message: '提交出错了:'+res.data.type,
                                    type: 'success'
                                })
                            }
                        }).catch(_=>{

                        })
                    })

                } else {
                    this.$message({
                        message: '请检查必填项目',
                        type: 'success'
                    })
                    this.$nextTick(()=>{
                        let errorElements=document.getElementsByClassName('is-error')
                        let getTop=(element,target)=> {
                            var realTop = element.offsetTop;
                            var parent = element.offsetParent;
                            while (target?parent!==target:parent !== null) {
                                realTop += parent.offsetTop;
                                parent = parent.offsetParent;
                            }
                            return realTop;
                        }
                        if(errorElements.length){
                            let errorDom=errorElements[0]
                            this.$refs.middle.scrollTop=getTop(errorDom,this.$refs.middle)
                        }
                    })
                    return false;
                }
            });
        },
        addProject() {
            this.projectList.map(pro=>{
                pro.isSelect=false
            })
            this.isChangePro=false
            this.selectProject = true
        },
        selectProjectNext() {
            let data = this.projectList.filter(item => item.isSelect==true)
            console.log(data)
            if(this.isChangePro){
                if(!data.length){
                    this.$message('啊哦,巧了,尚未检查到您选择的项目!')
                    return
                }
                // console.log(this.form.projectList[this.isChangeProIndex])
                let _data=data[0]
                this.form.projectList[this.isChangeProIndex]={
                    ...this.form.projectList[this.isChangeProIndex],
                    ..._data,
                    "field11407": _data.xmmc,
                    "field11406": _data.id,
                    "field11406_name": _data.xmmk,
                }
                // this.form={...this.form}
            }else{
                data.map(item=>{
                    let _data={
                        ...item,
                        key:new Date().getTime(),
                        "field11407": item.xmmc,
                        "field11406": item.id,
                        "field11406_name": item.xmmk,
                        "field7691": "",//内容
                        "field7692": 0,//计划内
                        "field7693": 0,//进度
                        "field7694": 7.0,//工时
                        "field7695": "",//备注
                        "field7705": 2411,
                        "isShowDesc":false,
                    }
                    this.form.projectList.push(_data)
                })
            }

            this.selectProject = false
            this.projectUserSelect = null
        },
        addDesc(item){
            item.isShowDesc=!item.isShowDesc
        },
        changeProject(index){
            this.projectList.map(pro=>{
                pro.isSelect=false
            })
            this.isChangePro=true
            this.isChangeProIndex=index
            this.selectProject=true
        },
        deletPro(list,item,index){
            list.splice(index,1)
        },
        projectSelect(e,item){
            if(e.ctrlKey&&!this.isChangePro){
                item.isSelect=!item.isSelect
            }else{
                this.projectList.map(pro=>{
                    pro.isSelect=false
                })
                item.isSelect=true
            }
        }
    }
}