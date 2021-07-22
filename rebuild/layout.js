//布局生成
let layout = ''

//公共样式
layout += `/*字体*/
body,input,textarea,button,select{
    font-family: "PingFang SC","Lantinghei SC","Microsoft YaHei","HanHei SC","Helvetica Neue","Open Sans",Arial,"Hiragino Sans GB","微软雅黑",STHeiti,"WenQuanYi Micro Hei",SimSun,sans-serif;
}
*{
    /* box-shadow: 0 0 0 1px red; */
}
/*边距*/
body,p,form,h1,h2,h3,h4,h5,h6,ul,ul>li,input,textarea{
    margin: 0;
    padding: 0;
}

/*盒模型*/
body, p, div, span, form, input, a{
    box-sizing: border-box;
    line-height: 1;
    position: relative;
}

/*a链接*/
a{
    color: inherit;
    text-decoration: none;
}
/*重置a链接选中样式*/
a:focus{
  outline: none !important;
}
/*fieldset*/
fieldset {
    border: 1px solid #f1f1f2;
    margin: 0;
    padding: 10px 20px 10px;
    border-radius:5px
}
/*图片*/
img{
    border: none;
    outline: none;
    display: block;
}
/*面板类*/
.g_panel {
  display: flex;
  align-items: stretch;
}
.g_panel > div {
  width: 100%;
}
/*删除表格里单元格间的间距*/
table {
  border-collapse: collapse;
  border-spacing: 0;
}
/*输入框*/
input,textarea{
    outline: none;
    border: none;
}

/*文字溢出*/
._ellipsis {
    text-align: justify;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.ellipsis {
    text-align: justify;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    line-height: initial;
}
.ellipsis2 {
    text-align: justify;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: initial;
}
.ellipsis3 {
    text-align: justify;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    line-height: initial;
}
.ellipsis4 {
    text-align: justify;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    line-height: initial;
}

/*滚动条*/
::-webkit-scrollbar-track-piece {
    background: 0 0;
}
::-webkit-scrollbar-corner,::-webkit-scrollbar-track{
    background: transparent
}
/*::-webkit-scrollbar-thumb {
    background-color: #b6c6ce;
    border: 3px solid transparent;
    background-clip: padding-box;
    border-radius: 10px;
}*/
/*::-webkit-scrollbar-thumb:hover {
    background-color: #4f6f7f;
}*/
/*::-webkit-scrollbar {
    width: 11px;
    height: 10px;
}*/

::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
::-webkit-scrollbar-thumb {
    background-color: #c2c2c2;
    background-clip: padding-box;
    min-height: 28px;
}
::-webkit-scrollbar-thumb:hover{
    background-color: #929292;
}
::-webkit-scrollbar-track-piece {
    background-color: transparent;
}

.g_hidden{
    overflow:hidden
}
.g_scroll_y {
    overflow-y: auto;
}
.g_scroll_x {
    overflow-x: auto;
}

/*全局布局*/
.g_con{
    min-width: 1000px;
    width: 75%;
    max-width: 1500px;
    margin: auto;
}
.g_con1200{
    width: 1200px;
    margin: auto;
}
.bw100{
    width: 100%;
    display: block;
}
.flex{
    display: flex;
}
.flex1{
    flex:1
}
.flex2{
    flex:2
}
.flex3{
    flex:3
}
.flex4{
    flex:4
}
.flex5{
    flex:5
}
.flex8{
    flex:8
}
.flex_wrap{
    display: flex;
    flex-wrap: wrap;
}
.flex_center,.flex_items_center{
    display: flex;
    align-items: center;
}
.flex_items_center>div,.flex_items_center>p,.flex_items_center>a{
    flex:1
}
.flex_right{
    display: flex;
    justify-content: flex-end;
}
.flex_reverse{
    display: flex;
    flex-direction: row-reverse;
}
.flex_content_center{
    display: flex;
    align-items: center;
    justify-content: center;
}
.flex_column{
    display: flex;
    flex-direction: column;
    align-items: stretch;
}
.flex_column_center{
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}
.self_start{
    align-self: flex-start;
}
.self_stretch{
    align-self: stretch;
}
.self_end{
    align-self: flex-end;
}
.stretch100{
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
.margin0{
    margin: 0 !important;
}

/*图片*/
.g_img{
    display: flex;
    align-items: center;
    justify-content: center;
}
.g_img img{
    width: 100%;
}
.child_block>a,.child_block>div,.child_block>p,.block{
    display: block;
}

/*背景类*/
.g_bg_cover{
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}
.g_bg_contain{
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
}
.g_bg_height_auto{
    background-size: auto 100%;
    background-position: center;
    background-repeat: no-repeat;
}

/*文本*/
.bold{
    font-weight: bold;
}
.text_center{
    text-align: center;
}
.text_right{
    text-align: right;
}
.block_center{
    margin: auto;
}

/*动画*/
.g_transition{
    transition: all 0.3s;
}

/*圆角*/
/*属性选择器*/
[class*="g_radius"]{
    overflow: hidden;
}
[class*="g_col"]{
    display: flex;
    flex-wrap: wrap;
}
.g_radius4{
    border-radius: 4px;
}
.g_radius6{
    border-radius: 6px;
}
.g_radius8{
    border-radius: 8px;
}
.g_radius10{
    border-radius: 10px;
}
.g_radius_all{
    border-radius: 500px;
}
.g_pointer{
    cursor: pointer;
}`

let addLayput = (num) => {
    layout += `\n
.g_pad${num}t,.g_pad${num}t_s>div,.g_pad${num}t_s>p,.g_pad${num}t_s>a{
    padding-top: ${num}px;
}
.g_pad${num}b,.g_pad${num}b_s>div,.g_pad${num}b_s>p,.g_pad${num}b_s>a{
    padding-bottom: ${num}px;
}
.g_pad${num}l,.g_pad${num}l_s>div,.g_pad${num}l_s>p,.g_pad${num}l_s>a{
    padding-left: ${num}px;
}
.g_pad${num}r,.g_pad${num}r_s>div,.g_pad${num}r_s>p,.g_pad${num}r_s>a{
    padding-right: ${num}px;
}
.g_pad${num}lr,.g_pad${num}lr_s>div,.g_pad${num}lr_s>p,.g_pad${num}lr_s>a{
    padding-left:  ${num}px;
    padding-right:  ${num}px;
}
.g_pad${num}tb,.g_pad${num}tb_s>div,.g_pad${num}tb_s>p,.g_pad${num}tb_s>a{
    padding-top: ${num}px;
    padding-bottom: ${num}px;
}
.g_pad${num},.g_pad${num}_s>div,.g_pad${num}_s>p,.g_pad${num}_s>a{
    padding: ${num}px;
}

.g_mar${num}t,.g_mar${num}t_s>div,.g_mar${num}t_s>p,.g_mar${num}t_s>a{
    margin-top: ${num}px;
}
.g_mar${num}b,.g_mar${num}b_s>div,.g_mar${num}b_s>p,.g_mar${num}b_s>a{
    margin-bottom: ${num}px;
}
.g_mar${num}l,.g_mar${num}l_s>div,.g_mar${num}l_s>p,.g_mar${num}l_s>a{
    margin-left: ${num}px;
}
.g_mar${num}r,.g_mar${num}r_s>div,.g_mar${num}r_s>p,.g_mar${num}r_s>a{
    margin-right: ${num}px;
}
.g_mar${num}lr,.g_mar${num}lr_s>div,.g_mar${num}lr_s>p,.g_mar${num}lr_s>a{
    margin: 0 ${num}px;
}
.g_mar${num}tb,.g_mar${num}tb_s>div,.g_mar${num}tb_s>p,.g_mar${num}tb_s>a{
    margin: ${num}px auto;
}
.g_mar${num},.g_mar${num}_s>div,.g_mar${num}_s>p,.g_mar${num}_s>a{
    margin: ${num}px;
}`
}
//边距类
layout+=`\n
/*边距类*/`
for (let i = 1; i < 11; i++) {
    let num = i * 4
    addLayput(num)
}
layout+=`\n
/*边距类-高阶*/`

for (let i = 5; i < 11; i++) {
    let num = i * 10
    addLayput(num)
}

//字体类
layout+=`\n
/*字体类*/`
for (let i = 1; i < 20; i++) {
    layout += `
.g_h${11 + i}{
    font-size: ${11 + i}px;
}`
}

layout+=`\n
/*字体类_高阶*/`
for (let i = 16; i < 30; i++) {
    layout += `
.g_h${i*2}{
    font-size: ${i*2}px;
}`
}
//宽高类
layout+=`\n
/*宽高类*/`

layout+=`
.g_wid100_vw{
    width: 100vw;
}
.g_wid100_vh{
    height: 100vh;
}
.g_wid100_all{
    width: 100vw;
    height: 100vh;
}
`
for (let i = 1; i < 15; i++) {
    let num=10 + i * 10
    layout += `
.g_wid${num}{
    width: ${num}px;
}
.g_wid${num}_h{
    height: ${num}px;
}
.g_wid${num}_ah{
    width: ${num}px;
    height: ${num}px;
}`
}

layout+=`\n
/*宽高类_高阶*/`
for (let i = 1; i < 10; i++) {
    let num=150 + i * 50
    layout += `
.g_wid${num}{
    width: ${num}px;
}
.g_wid${num}_h{
    height: ${num}px;
}
.g_wid${num}_ah{
    width: ${num}px;
    height: ${num}px;
}`
}

//颜色类
/* 颜色 */
layout+=`\n
/*颜色类*/`
let colors = {
    main_color:'#0b59da',
    main_active_color:'#004abd',
    desc_color:'#636d7e',
    border_color:'#e5ecf0',
    text_color:'#1a1a1a',
    text2_color:'#a8a8a8',
    bg_color:'#f0f2f5',
    darkgray_color:'darkgray',
    white_color:'white',
    input_bg_color:'#f4f5f5',
    fieldset_border_color:'#f1f1f2',
    form_label_color:'#404346',
    cancel_color:'#6b7075',
    form_main_color:'#fe2c55',
    form_main_active_color:'#db2045',
    form_select_bg_color:'#eeeeee',
    form_select_bg_active_color:'#e8e8e8',
    form_select_active_color:'#e7e7e7',
    form_add_pro_btn_color:'#d4d4d4',
}
let keyIndex=0
for(let key in colors){
    if(keyIndex==0){
        let colorStr='\n:root{\n'
        for(let key2 in colors){
            colorStr+=`        --${key2}:${colors[key2]};\n`
        }
        colorStr+='    }'
        layout+=colorStr
    }
    keyIndex++
    layout+=`
.g_${key}{
    color: var(--${key});
}
.g_${key.replace(/_color/ig,'_bgcolor')}{
    background-color: var(--${key});
}`
}

//栅格布局
layout+=`\n
/*栅格布局*/`
for (let i=2;i<9;i++){
    let str=`
.g_col_8_10>div,.g_col_8_10>a{
    width: calc((99.999% - 7 * 10px) / 8);
}
.g_col_8_10>div:not(:nth-child(8n-7)),.g_col_8_10>a:not(:nth-child(8n-7)){
    background-color: dodgerblue;
    margin-left: 10px;
}`
    layout+=`
`
    for(let j=1;j<13-i;j++){
        let margin=j*8
        layout+=`
.g_col_${i}_${margin}>div,.g_col_${i}_${margin}>a{
    width: calc((99.999% - ${i-1} * ${margin}px) / ${i});
}
.g_col_${i}_${margin}>div:not(:nth-child(${i}n-${i-1})),.g_col_${i}_${margin}>a:not(:nth-child(${i}n-${i-1})){
    margin-left: ${margin}px;
}`
    }
}
console.log(layout)
let fs=require('fs')
let exportsPath = './css/layout.css'
let path=require('path')
let pathsInfo=path.parse(exportsPath)
fs.mkdirSync(pathsInfo.dir,{ recursive: true })
fs.writeFile(exportsPath, layout, () => {})
