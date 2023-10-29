'use strict';
window.qhly_import(function(lib, game, ui, get, ai, _status){
    if(!lib.qhlyPlugins){
        lib.qhlyPlugins = [];
    }
    lib.qhlyPlugins.push({
        id:"code_999888",
        pluginType:'角色介绍附加页',
        name:'代码',
        author:'寰宇星城',
        label:"代码插件",
        intro:"此插件为千幻聆音自带，用于查看角色代码。",
        enable:function(){
            return true;
        },
        characterFilter:function(name){
            return true;
        },
        getCodeSkills:function(name){
            var skills = game.qhly_getViewSkills(name);
            var ret = [];
            for(var skill of skills){
                ret.push(skill);
                var info = get.info(skill);
                if(info && info.global){
                    if(typeof info.global == 'string'){
                        ret.push(info.global);
                    }else if(Array.isArray(info.global)){
                        ret.addArray(info.global);
                    }
                }
            }
            return ret;
        },
        content:function(name){
            var str = "";
            var skills = this.getCodeSkills(name);
            for(var skill of skills){
                str += "技能："+get.translation(skill)+"&nbsp;[<font color='blue'>"+skill+"</font>]"+"<br>";
                var skillInfo = get.info(skill);
                if(skillInfo){
                    str += "<br>技能描述：<br>";
                    str += lib.translate[skill+"_info"];
                    str += "<br><br>代码：";
                    str += "<img id='qh_code_copy_"+skill+"' src='"+lib.assetURL+"extension/千幻聆音/image/copy.png' style='width:25px;height:25px;'/>";
                    str += "<br>";
                    str += "<textarea id='qh_input_skill_"+skill+"'>";
                    str += "</textarea>";
                }else{
                    str += "暂无代码";
                }
                str += "<br><br>";
            }
            return str;
        },
        banSkillInfoKey:['_priority'],
        filterSkillInfo:function(info){
            var info2 = {};
            for(var key in info){
                if(!this.banSkillInfoKey.contains(key)){
                    info2[key] = info[key];
                }
            }
            if(info.subSkill){
                for(var key in info.subSkill){
                    let r = this.filterSkillInfo(info.subSkill[key]);
                    info.subSkill[key] = r;
                }
            }
            return info2;
        },
        handleView:function(view,name){
            var that = this;
            var func = function(){
                var skills = that.getCodeSkills(name);
                for(var skill of skills){
                    var input = document.getElementById('qh_input_skill_'+skill);
                    var copyImg = document.getElementById('qh_code_copy_'+skill);
                    if(input){
                        var argi="lib.skill['"+skill+"']="+get.stringify(that.filterSkillInfo(get.info(skill)));
                        var editor = window.CodeMirror.fromTextArea(input,{
                            mode:'javascript',
                            lineNumbers: true,     
                            indentUnit: 4,         
                            styleActiveLine: true, 
                            matchBrackets: true,   
                            lineWrapping: true,     
                        });
                        editor.setValue(argi);
                        editor.setSize("100%","300px");
                        if(copyImg){
                            ui.qhly_addListenFunc(copyImg);
                            (function(skill,argi){
                                copyImg.listen(function(){
                                    game.qhly_copyText(argi);
                                });
                            })(skill,argi);
                        }
                        //lib.setScroll(input);
                    }
                }
            };
            if(window.CodeMirror){
                func();
            }else{
                lib.init.css(lib.assetURL+'layout/default','codemirror');
                lib.init.js(lib.assetURL+'game','codemirror',func);
            }
        }
    });
});