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
    `,
    data(){
        return {
            projectList:[]
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
                    }
                })
            }
            getListData()
        }
    }
}