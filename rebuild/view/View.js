View = {
    template: `
        <div class="flex1 content">
            <div class="view_content">
                <div v-if="loading" class="g_pad50tb view_loading">
                    <loading position="absolute"></loading>
                </div>
                <div v-if="columns&&columns.length>0" class="g_pad12">
                    <el-table :data="tableData" stripe border style="width: 100%">
                        <el-table-column v-for="item in columns"
                          :prop="item.dbField+'span'"
                          :label="item.title"
                          >
                          <template #default="{row}" v-if="item.dbField=='requestname'">
                            <span>{{ row.requestname }}</span>
                            <span class="g_mar4l _label _labe_green" v-if="row.isTodayDate">今日已完成</span>
                          </template>
                        </el-table-column>
                    </el-table>
                    <div class="text_right g_pad8tb flex_center flex_right el_pagination" v-if="page.count>0">
                        <span class="g_h14 g_text2_color">共{{page.count}}条数据</span>
                        <el-pagination @current-change="getList" :page-size="page.pageSize" v-model:currentPage="page.pageNum" background layout="prev, pager, next" :total="page.count"></el-pagination>
                    </div>
                </div>
            </div>   
        </div>       
    `,
    data(){
      return {
          columns:[],
          tableData:[],
          loading:false,
          page:{
              pageSize:parseInt((innerHeight-93-48-16*2)/50),
              pageNum:1,
              count:0
          },
          dataKey:''
      }
    },
    created(){
        this.init()
    },
    methods:{
        clearHtmlTag(str){
            return str.replace(/<\/?.+?\/?>/g,'')
        },
        getDate(){
            let date=new Date()
            let add0=(num,prefix='')=>{
                return num<10?prefix+'0'+num:prefix+num
            }
            return add0(date.getFullYear())+add0(date.getMonth()+1,'-')+add0(date.getDate(),'-')
        },
        init(){
            /*getLeftMenu().then(leftTree=>{
                getLeftMenuOfCount().then(leftTreeCount=>{
                    debugger
                    let treeCount=leftTreeCount.treecount
                    if(treeCount){
                        let treeData=leftTree.treedata
                        let addTreeCount=(treeData)=>{
                            treeData.map(item=>{
                                item.count=treeCount[item.domid]
                                if(item.childs){
                                    addTreeCount(item.childs)
                                }
                            })
                        }
                        addTreeCount(treeData)
                        console.log(treeData)
                    }else{
                        console.log('未获取到数据')
                    }
                })
            })*/
            this.loading=true
            splitPageKey().then(keyData=>{
                this.dataKey=keyData.sessionkey
                setPageSize({dataKey:this.dataKey,pageSize:this.page.pageSize}).then(_=>{
                    this.getList()
                })
            })
        },
        getList(){
            let dataKey=this.dataKey
            this.loading=true
            getViewList({dataKey:dataKey,current:this.page.pageNum}).then(listData=>{
                this.loading=false
                this.tableData=listData.datas
                let todayDate=this.getDate()
                let removeIndex=-1
                this.tableData.map((item,index)=>{
                    for(key in item){
                        item[key]=this.clearHtmlTag(item[key])
                    }
                    try{
                        let requestNameDate = item.requestname.match(/\d+/g).slice(-3)
                        if(requestNameDate&&requestNameDate.length>=3){
                            item.isTodayDate=requestNameDate.join('-')==todayDate
                            if(item.isTodayDate){
                                removeIndex=index
                            }
                        }
                    }catch (e){
                        item.isTodayDate=false
                    }
                })


                console.log('removeIndex')
                console.log(removeIndex)
                if(removeIndex>0){
                    let tempData=this.tableData[removeIndex]
                    this.tableData[removeIndex]=this.tableData[0]
                    this.tableData[0]=tempData
                }
                this.columns=listData.columns.filter(item=>item.display=='true'&&item.title!=='系统名称'&&item.title!=='未操作者')
            }).catch(error=>{
                this.loading=false
            })
            getWriteCount(dataKey).then(res=>{
                this.page.count=res.count
            })
        }
    }
}
