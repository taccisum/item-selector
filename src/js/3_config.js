(function () {
    itemSelector.define("DEF_CONFIG", function () {
        return {

            /**
             * todo::未完成
             * [Boolean]是否使用单例
             * 为true时所有实例将使用同一个模态框，可以避免页面上存在过多的实例
             */
            singleton: false,

            /**
             * [Boolean]是否开启懒加载
             * 为true时模态框将在第一次触发绑定元素的点击事件时才被渲染
             */
            lazyLoad: true,

            /**
             * [Object]将存储为data-modal-id属性，为null则使用计数器生成一个id
             */
            // id: null,
            /**
             * [HTML]模态框标题
             */
            title: "item selector",
            /**
             * [String]模态框宽度
             */
            width: null,
            /**
             * [String]模态框.modal-body高度
             */
            height: "400px",
            /**
             * [Array]树数据，必需属性：id, pid, text, isExist
             */
            data: [],
            /**
             * [String]当数据的icon为null时显示的默认图标
             */
            icon: "fa fa-star",
            /**
             * todo::
             * 是否显示搜索框
             */
            search: true,
            /**
             * [fn]模态框展示前触发
             * @param api todo::
             * @param $element 模态框的jQuery对象
             */
            onShow: function (api, $element) {
            },
            /**
             * [fn]模态框消失后触发
             * @param api todo::
             * @param $element 模态框的jQuery对象
             */
            afterClose: function (api, $element) {
            },

            /**
             * [Array]按钮组，null或不为数组时将使用默认的按钮，并使用onSubmit作为默认按钮的点击回调
             */
            // buttons: [
            //     {
            //         id: "",
            //         cls: "",
            //         text: "",
            //         callback: function (api, data) {}
            //     }
            // ],
            /**
             * [fn]点击默认的提交按钮时触发，返回值为true则关闭模态框
             * 当buttons != null && buttons instanceof Array时，此属性失效
             * @param api todo::
             * @param data
             */
            onSubmit: function (api, data) {
                return true;
            },
        };
    });
})();