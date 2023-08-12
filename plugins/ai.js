'use strict';
window.qhly_import(function(lib, game, ui, get, ai, _status){
    if(!lib.qhlyPlugins){
        lib.qhlyPlugins = [];
    }
    lib.qhlyPlugins.push({
        id:"ai_777213231",
        pluginType:'角色介绍附加页',
        name:'AI',
        author:'寰宇星城',
        label:"AI优化插件",
        intro:"此插件仅在安装了《AI优化》扩展时生效。《AI优化》扩展下载可加群：715181494。",
        enable:function(){
            return game.qhly_hasExtension('AI优化');//插件是否可用
        },
        characterFilter:function(name){
            return true;
        },
        models:[{
            name:"主公禁将",
            key:"zhu",
        },{
            name:"忠臣禁将",
            key:"zhong",
        },{
            name:"反贼禁将",
            key:'fan',
        },{
            name:"内奸禁将",
            key:"nei",
        },{
            name:"地主禁将",
            key:"yi",
        },{
            name:"二号位农民禁将",
            key:"er",
        },{
            name:"三号位农民禁将",
            key:"san",
        }],
        content:function(name){
            var str = "<h2>AI禁将设置</h2>";
            var models = this.models;
            for(var i=0;i<models.length;i++){
                (function(i){
                    var model = models[i];
                    str += "<p><span style='display:inline-block;height:30px;'>"
                    +"<img id='qhplugin_ai_ban_"+model.key+"'/><span id='qhplugin_ai_ban_text_"+model.key+
                    "' style='display:inline-block;position:relative;bottom:25%;'>"+model.name+"</span></span></p>";
                })(i);
            }
            str += "<font size='2' color='gray'>此页面功能来自《AI优化》扩展。</font>";
            return str;
        },
        handleView:function(view,name){
            var models = this.models;
            for(var model of models){
                (function(model){
                    var check = document.getElementById("qhplugin_ai_ban_"+model.key);
                    var text = document.getElementById("qhplugin_ai_ban_text_"+model.key);
                    var list = lib.config["extension_AI优化_"+model.key];
                    if(!list){
                        list = [];
                    }
                    ui.qhly_initCheckBox(check,list.contains(name));
                    ui.qhly_bindCheckBoxAndSpanText(check,text);
                    check.qhly_onchecked=function(c){
                        if(c){
                            list.add(name);
                        }else{
                            list.remove(name);
                        }
                        game.saveConfig("extension_AI优化_"+model.key,list);
                    };
                })(model);
            }
        }
    });
});