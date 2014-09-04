/*
 * @description 封装localstorage，IE6/7下只能存取于同一路径下的文件，单个文件大小不得大于128k，key无法区分大小写。firefox 14+去掉了globalStorage
 * @author Evan(zaiwei923@gmail.com)
 * @date 2014/9/3
 * @time 17:23
*/

(function( window ){
    "use strict";

var toolkit = window.toolkit || {};

if( toolkit.localStorage ){
    return;
}

var wls = window.localStorage;

if( wls ){

    toolkit.localStorage = {
        length: wls.length,

        setItem: function ( key, value) {
            if( key === '' || key == null || arguments.length < 2 ){
                return ;
            }

            wls.setItem(key, value);
            this.length = wls.length;
        },

        getItem: function ( key ) {
            if( key === '' || key == null ){
                return ;
            }

            return wls.getItem( key );
        },

        removeItem: function ( key ) {
            if( key === '' || key == null ){
                return ;
            }

            wls.removeItem( key );
            this.length = wls.length;
        },

        key: function ( index ) {
            var index = +index;
            if( !isFinite(index) ){
                return ;
            }

            return wls.key( index );
        },

        clear: function () {
            wls.clear();
            this.length = 0;
        }
    }

} else {

    var name = location.hostname || '__storage',  //用于缓存主要数据
        cache = '__cache__',  //用于缓存key list
        prefix = '_pf_', 
        __storage = document.createElement('style'); 

    __storage.addBehavior('#default#userData');
    document.getElementsByTagName('head')[0].appendChild(__storage);

    /*
     * @fn 增加一个key
     * @param {key}
     * @private
    */
    var addKey = function ( key ) {
        __storage.load(cache);
        var value = __storage.getAttribute(cache);

        if( value == null ){
            __storage.setAttribute(cache, key);
            __storage.save(cache);
        } else {
            if( value.indexOf(key) > -1 ){
                return ;
            } else {
                __storage.setAttribute(cache, value + '|' + key);
                __storage.save(cache);
            }
        }
        value = __storage.getAttribute(cache);
        toolkit.localStorage.length = value.split('|').length;
    }

    /*
     * @fn 删除某个key
     * @param {key}
     * @private
    */
    var removeKey = function ( key ) {
        __storage.load(cache);
        var value = __storage.getAttribute(cache);

        if( value == null || value.indexOf(key) === -1 ){
            return ;
        }

        var list = value.split('|'),
            count = 0,
            length = list.length;

        for(; count < length; count++){
            if( list[count] === key ){
                list.splice(count, 1);
                __storage.setAttribute(cache, list.join('|'));
                __storage.save(cache);
                break;
            }
        }

        if( list + '' === '' ){
            __storage.removeAttribute(cache);
            toolkit.localStorage.length = 0;
            __storage.save(cache);
        } else {
            toolkit.localStorage.length = list.length;
        }
    }

    /*
     * @fn 获取本地存储中的所有key
     * @return {array} 
     * @private
    */
    var getAllKey = function () {
        
        __storage.load(cache);
        var value = __storage.getAttribute(cache),
            ret = [];
        
        if( value == null ){
            return ret;
        }

        return (value + '').split('|');
    }


    toolkit.localStorage = {
        length: (function(){

            __storage.load(cache);
            var ret = __storage.getAttribute(cache);

            return ret == null ? 0 : ret.split('|').length;
        })(),

        /*
         * @method localStorage setItem
         * @public
        */
        setItem: function ( key, value ) {
            if( key === '' || key == null || arguments.length < 2 ){
                return ;
            }
            __storage.load(name);
            __storage.setAttribute(prefix + key, value);
            __storage.save(name);
            addKey(key);
        },

        /*
         * @method localStorage getItem
         * @public
        */
        getItem: function ( key ) {
            if( key === '' || key == null ){
                return ;
            }
            __storage.load(name);
            return __storage.getAttribute(prefix + key );
        },

        /*
         * @method localStorage removeItem
         * @public
        */
        removeItem: function ( key ) {
            if( key === '' || key == null ){
                return ;
            }
            __storage.load(name);
            __storage.removeAttribute(prefix + key );
            __storage.save(name);
            removeKey(key);
        },

        /*
         * @method localStorage clear
         * @public
        */
        clear: function () {
            var ret = getAllKey();

            __storage.removeAttribute(cache);
            __storage.save(cache);

            __storage.load(name);
            for( var count = 0, key; key = ret[count++]; ){
                __storage.removeAttribute(prefix + key);
            }
            __storage.save(name);
            this.length = 0;
        },

        /*
         * @method localStorage key
         * @public
        */
        key: function ( index ) {
            var index = +index;
            if( !isFinite(index) ){
                return ;
            }

            var ret = getAllKey(),
                curKey = ret[index];

            if( curKey == null ){
                return ;
            }
            __storage.load(name);
            return __storage.getAttribute(prefix + curKey);
        }
    }
    
}

window.toolkit = toolkit;

})( window );