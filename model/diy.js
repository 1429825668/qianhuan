'use strict';
window.qhly_import(function(lib, game, ui, get, ai, _status){
    if(ui.qhly)return;
    lib.init.css(lib.assetURL+'extension/千幻聆音/model','diy');
    class Panel{
        constructor(str,div){
            if(!div){
                this.mainView = document.createElement('div');
            }else{
                this.mainView = div;
            }
            if(str){
                if(Array.isArray(str)){
                    str.forEach(c=>this.mainView.classList.add(c));
                }else{
                    this.mainView.classList.add(str);
                }
            }
            this.mainView.qhPanel = this;
        }
        refresh(){
            //super.refresh();
            this.forEachChildNode(item=>{
                if(item.qhPanel){
                    item.qhPanel.refresh();
                }
            });
        }
        hide(){
            this.mainView.hide();
        }
        show(){
            this.mainView.show();
        }
        getComputedCssStyle(propname,fallback){
            let t = getComputedStyle(this.mainView,null);
            let ret = getComputedStyle(this.mainView,null).getPropertyValue(propname);
            if(ret === undefined || ret === null || ret.length === 0){
                return fallback;
            }
            return ret;
        }
        setHtml(html){
            this.mainView.innerHTML = html;
        }
        addCssClass(str){
            if(Array.isArray(str)){
                str.forEach(c=>this.mainView.classList.add(c));
            }else{
                this.mainView.classList.add(str);
            }
        }
        listen(func){
            this.mainView.listen(func);
        }
        removeCssClass(str){
            if(Array.isArray(str)){
                str.forEach(c=>this.mainView.classList.remove(c));
            }else{
                this.mainView.classList.remove(str);
            }
        }
        setAttribute(key,value){
            this.mainView.setAttribute(key,value);
        }
        setCssStyle(obj){
            Object.keys(obj).forEach(key=>this.mainView.style[key] = obj[key]);
        }
        setCssProperty(key,value){
            this.mainView.style.setProperty(key,value);
        }
        getCssStyle(){
            return this.mainView.style;
        }
        forEachChildNode(func){
            for(let i=0;i<this.mainView.childElementCount;i++){
                func(this.mainView.childNodes[i]);
            }
        }
        addChild(child){
            if(child instanceof ui.qhly.Panel){
                this.mainView.appendChild(child.mainView);
            }else if(child instanceof HTMLDivElement){
                let panelChild = new ui.qhly.Panel(null,child);
                this.mainView.appendChild(child);
                return panelChild;
            }
            return child;
        }
        removeChild(child){
            if(child instanceof ui.qhly.Panel){
                this.mainView.removeChild(child.mainView);
            }else{
                this.mainView.removeChild(child);
            }
        }
        getElement(id){
            if(!this._elements){
                this._elements = {};
            }
            let ret = this._elements[id];
            if(!ret){
                ret = document.getElementById(id);
                this._elements[id] = ret;
            }
            return ret;
        }
    };
    class Button extends Panel{
        constructor(str){
            super(str);
            this.addCssClass('.qhp-button');
        }
        setClickListener(func){
            this.mainView.listen(func);
        }
    };
    class SwitchButton extends Button{
        constructor(str,checked,mode){
            super(str);
            this.checked = (checked === true);
            this.checkedStateListeners = [];
            this.mode = mode ? mode:'normal';
            this.listen(()=>{
                if(this.mode == 'normal'){
                    this.checked = !this.checked;
                    this.refresh();
                    this.checkedStateListeners.forEach(func=>func(this.checked));
                }else if(this.mode == 'check'){
                    if(!this.checked){
                        this.checked = true;
                        this.refresh();
                        this.checkedStateListeners.forEach(func=>func(this.checked));
                    }
                }else if(this.mode == 'uncheck'){
                    if(this.checked){
                        this.checked = false;
                        this.refresh();
                        this.checkedStateListeners.forEach(func=>func(this.checked));
                    }
                }
            });
        }
        setMode(mode){
            this.mode = mode;
        }
        addCheckedStateChangeListener(func){
            this.checkedStateListeners.add(func);
        }
        removeCheckedStateChangeListener(func){
            this.checkedStateListeners.remove(func);
        }
        refresh(){
            if(this.checked){
                if(this.checkedCssClass)this.addCssClass(this.checkedCssClass);
            }else{
                if(this.checkedCssClass)this.removeCssClass(this.checkedCssClass);
            }
            super.refresh();
        }
        setCheckedCssClass(clazz){
            this.checkedCssClass = clazz;
            if(this.checked){
                this.addCssClass(clazz);
            }else{
                this.removeCssClass(clazz);
            }
        }
        isChecked(){
            return this.checked;
        }
        setChecked(checked,listen){
            let callListener = this.checked!=checked && listen;
            this.checked = checked;
            this.refresh();
            if(callListener){
                this.checkedStateListeners.forEach(func=>func(checked));
            }
        }
    };
    class StackPanelGroup{
        constructor(panels,showing){
            this.panels = panels;
            this.showing = showing;
            this.panels.forEach(panel=>{
                if(panel==showing){
                    panel.show();
                }else{
                    panel.hide();
                }
            });
        }
        setShowing(showing){
            this.showing = showing;
            this.panels.forEach(panel=>{
                if(panel==showing){
                    panel.show();
                }else{
                    panel.hide();
                }
            });
        }
    }
    class SwitchButtonGroup{
        constructor(buttons){
            this.buttons = [];
            if(buttons){
                this.addButtons(buttons);
            }
            this.switchListeners = [];
        }
        addCheckButtonChangedListener(func){
            this.switchListeners.add(func);
        }
        addButton(button){
            if(button instanceof SwitchButton){
                this.buttons.push(button);
                button.addCheckedStateChangeListener((checked)=>{
                    if(checked){
                        this.buttons.forEach(button2=>{
                            if(button2!=button){
                                button2.setChecked(false,false);
                            }
                        });
                        this.switchListeners.forEach(listener=>listener(button));
                    }
                });
            }
        }
        addButtons(buttons){
            buttons.forEach(button=>{
                this.addButton(button);
            });
        }
    };
    class HorizontalBarPanel extends Panel{
        constructor(clazz){
            super(clazz);
            //this.unitValue = parseFloat(this.getComputedCssStyle('--unit-width',10));
            //this.unitType = this.getComputedCssStyle('--unit-type','px');
            this._items = [];
        }
        addBarItem(panel,refresh){
            this._items.add(this.addChild(panel));
            if(refresh!==false){
                this.refresh();
            }
        }
        removeBarItem(panel){
            this.removeChild(panel);
            this._items.remove(panel);
            this.refresh();
        }
        refresh(){
            this.setCssProperty('--unit-count',this._items.length);
            let unitWidth = (100/this._items.length).toFixed(2)+"%";
            this._items.forEach((item,index)=>{
                item.setCssStyle({
                    left:(index/this._items.length*100).toFixed(2)+"%",
                    width:unitWidth,
                    top:0,
                    height:'100%',
                });
            });
            super.refresh();
        }
        clearBarItems(){
            this._items.forEach(item=>{
                this.removeChild(item);
            });
            this._items = [];
            this.refresh();
        }
    }
    class GridPanel extends Panel{
        constructor(row,column){
            this.row = row;
            this.column = column;
        }
    };
    class Avatar extends Panel{
        /**
         * 
         * @param {string} avatar 
         * @param {string} obj.backFrame
         * @param {string} obj.picture
         * @param {string} obj.frontFrame 
         */
        constructor(avatar,obj){
            super(avatar);
            this.backFrame = this.addChild(new ui.qhly.Panel(obj.backFrame));
            this.picture = this.addChild(new ui.qhly.Panel(obj.picture));
            this.frontFrame = this.addChild(new ui.qhly.Panel(obj.frontFrame));
            this.backFrame.setCssStyle({zIndex:1});
            this.picture.setCssStyle({zIndex:2});
            this.picture.addCssClass('qh-not-replace');
            this.frontFrame.setCssStyle({zIndex:3});
        }
        setImage(path){
            this.picture.setCssStyle({
                backgroundImage:"url("+lib.assetURL+path+")"
            });
        }
        setCharacter(name,skin){
            if(!skin){
                this.picture.mainView.setBackground('character',name);
            }else if(skin !== true){
                this.picture.mainView.setBackgroundImage(game.qhly_getSkinFile(name,skin));
            }else{
                skin = game.qhly_getSkin(name);
                if(skin){
                    this.picture.mainView.setBackgroundImage(game.qhly_getSkinFile(name,skin));
                }else{
                    this.picture.mainView.setBackground(name,'character');
                }
            }
        }
    }
    ui.qhly = {
        Panel:Panel,
        GridPanel:GridPanel,
        Button:Button,
        SwitchButton:SwitchButton,
        SwitchButtonGroup:SwitchButtonGroup,
        StackPanelGroup:StackPanelGroup,
        HorizontalBarPanel:HorizontalBarPanel,
        Avatar:Avatar
    };
    lib.qhlydiy = {
        getSuitProp:function(propName,fallback){
            let ret = lib.qhly_viewskin[lib.config.qhly_currentViewSkin][propName];
            if(ret === undefined || ret === null){
                return fallback;
            }
            return ret;
        },
        playSuitAudio:function(audioName,repeated){
            if(!repeated){
                game.playAudio('../'+lib.qhlydiy.getSuitProp('extensionPath','')
                +"/"+lib.qhlydiy.getSuitProp('audioDir','audio')+"/"+audioName);
            }else{
                game.qhly_playAudioRepeatable('../'+lib.qhlydiy.getSuitProp('extensionPath','')
                +"/"+lib.qhlydiy.getSuitProp('audioDir','audio')+"/"+audioName);
            }
        },
        addSuitFont:function(name,file){
            let fontPath = lib.qhlydiy.getSuitProp('extensionPath','')+'/'+lib.qhlydiy.getSuitProp('fontDir','font');
            if (ui && ui.css && ui.css.fontsheet && ui.css.fontsheet.sheet && ui.css.fontsheet.sheet.insertRule) {
                ui.css.fontsheet.sheet.insertRule("@font-face {font-family: '"+name+"';src: url('" +fontPath+"/"+file + "');}", 0);
            } else {
                if(!ui.qhlycss)ui.qhlycss = lib.init.sheet();
                ui.qhlycss.sheet.insertRule("@font-face {font-family: '"+name+"';src: url('" +fontPath+"/"+file + "');}", 0);
            }
        },
        getTranslatedNameHorizontal:function(name){
            var pattern = lib.config.qhly_name_pattern;
            if(!pattern)pattern = "full";
            switch(pattern){
                case "full":
                  return get.slimNameHorizontal(name);
                case "full_pure":
                  return lib.qhly_filterPlainText(get.slimNameHorizontal(name));
                case "raw":
                  return get.rawName(name);
            }
            return get.translation(name);
        }
    };
});