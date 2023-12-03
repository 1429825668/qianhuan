'use strict';
window.qhly_import(function (lib, game, ui, get, ai, _status) {
    lib.qhly_skinChange = {
        re_caocao:{
            不畏权贵:{
                source:'kill',
                return:true,
                image:'re_caocao/山河常青.jpg',
                audio:'re_caocao/山河常青/'
            }
        },
        caochun: {                                                   //武将id
            虎啸龙渊: {                                               //皮肤名
                source: 'hp_2',                                      //*必填属性，变身原因，"hp_x"表示血量低于x变身，高于x变回来(变身只能有一种原因！)
                phase: true,                                         //加上此行会让回血换肤效果在当前回合结束才触发
                audio: '虎啸龙渊/虎啸龙渊2/',                          //*必填属性，变身后的音效文件夹，从sanguoaudio/caochun/后面写
                image: 'caochun/虎啸龙渊/虎啸龙渊2.jpg',               //*必填属性，变身后的皮肤文件，从sanguoskin/或者sanguolutouskin/后面写（注：新版本因要判断路径所以只支持jpg格式的变身皮肤文件）
            }
        },
        shen_guojia: {
            倚星折月: {
                cardaudio: true,                                     //使用专属卡牌音效（现在专属卡牌音效也分变身前和变身后了，请分别放在变身前后的音效文件夹内）
                source: 'stianyi',                                   //变身原因为发动某技能，直接写技能名，不管是转换技、限定技、觉醒技甚至是普通技能都可以触发，用一次变身，再用一次变回来
                audio: '倚星折月/倚星折月2/',
                image: 'shen_guojia/倚星折月/倚星折月2.jpg',
            }
        },
        test: {                                                      //这只是个例子
            测试: {
                source: 'kill',                                      //变身原因为造成击杀
                return: true,                                        //加上此行会在每次造成击杀时来回换肤，否则只会在第一次击杀后换肤就不再换回来了
                audio: '测试/测试2/',
                image: 'test/测试/测试2.jpg',
            }
        },
    }
});