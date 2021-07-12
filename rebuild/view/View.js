View = {
    template: `
        <div class="flex1 content">
            <div class="view_content">
                <div v-if="loading" class="g_pad50tb">
                    <loading></loading>
                </div>
                <div v-if="columns&&columns.length>0" class="g_pad12">
                    <el-table :data="tableData" stripe border style="width: 100%">
                        <el-table-column v-for="item in columns"
                          :prop="item.dbField+'span'"
                          :label="item.title"
                          >
                        </el-table-column>
                    </el-table>
                    <div class="text_right g_pad8tb flex_center flex_right" v-if="page.count>0">
                        <span>共{{page.count}}条数据</span>
                        <el-pagination   @current-change="getList" :page-size="page.pageSize" v-model:currentPage="page.pageNum" background layout="prev, pager, next" :total="page.count"></el-pagination>
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
            getViewList({dataKey:dataKey,current:this.page.pageNum}).then(listData=>{
                this.loading=false
                this.tableData=listData.datas
                this.tableData.map(item=>{
                    for(key in item){
                        item[key]=this.clearHtmlTag(item[key])
                    }
                })
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