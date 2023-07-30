'use strict';
window.qhly_import(function(){
    if(!lib.qhlyPlugins){
        lib.qhlyPlugins = [];
    }
    lib.qhlyPlugins.push({
        pluginType:'角色介绍附加页',//表示插件类型
        name:'制卡',//“角色介绍附加页”显示的名字。
        enable:function(){
            return game.qhly_hasExtension('DIYEditor');//插件是否可用
        },
        characterFilter:function(name){
            return true;//限制插件只对某些角色生效
        },
        content:function(){
            //附加页内显示的内容。
            var str = "<img src='";
            str += lib.assetURL;
            str += "extension/千幻聆音/image/qhly_pic_zhika.png' style='width:60px;height:60px;'/>制卡说明<br>";
            str += "制卡功能来源于扩展DIYEditor。如果出现未成功载入武将信息的情况，请返回后重新载入。<br>相关问题请在扩展作者钫酸酱的无名杀交流群反馈。<br>群号：828182346<br><br>";
            str += "<span id='qhly_zhika_button'><b style='color:blue'>点击此处使用当前皮肤制卡</b></span>";
            return str;
        },
        handleView:function(view,name){
            //为附加页内的元素添加点击事件和其它逻辑。
            var button = document.getElementById('qhly_zhika_button');
            ui.qhly_addListenFunc(button);
            button.listen(function(){
                game.openCharacterCard(name,game.qhly_getSkinFile(name,game.qhly_getSkin(name)));
            });
        }
    });
});