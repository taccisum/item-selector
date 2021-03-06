(function () {
    itemSelector.define("core", function () {
        var DEF_CONFIG = itemSelector.require("DEF_CONFIG");
        var EVENTS = itemSelector.require("EVENTS");
        var util = itemSelector.require("util");

        function render(options) {
            var id = options.id || util.generateId();
            var $modal = null;

            //render modal
            (function () {
                var title = options.title;
                var height = options.height;
                var width = options.width;
                var html = '\
            <div data-modal-id="' + id + '" class="modal fade" tabindex="-1">\
              <div style="width: ' + width + ';" class="modal-dialog">\
                <div class="modal-content">\
                    <div class="modal-header">\
                        <button type="button" class="close" data-dismiss="modal">×</button>\
                        <h4 class="modal-title">' + title + '</h4>\
                    </div>\
                    <div style="padding: 35px; height: ' + height + ';" class="modal-body">\
                        <table style="width: 100%; height:100%; text-align: center; font-size: 12px;">\
                            <tbody>\
                                <tr>\
                                    <td style="width: 45%;">\
                                        <div style="height: 100%; overflow: auto; text-align: left; margin-bottom: 0;" class="panel panel-default">\
                                            <div class="panel-body">\
                                                <input class="form-control search-left" placeholder="输入搜索内容……">\
                                                <br/>\
                                                <div class="btn-group">\
                                                    <button class="select-all btn btn-info btn-xs"><i class="fa fa-check-square"></i></button>\
                                                    <button class="de-select-all btn btn-info btn-xs"><i class="fa fa-square"></i></button>\
                                                    <button class="open-all btn btn-info btn-xs"><i class="fa fa-plus-square"></i></button>\
                                                    <button class="close-all btn btn-info btn-xs"><i class="fa fa-minus-square"></i></button>\
                                                </div>\
                                                <br/>\
                                                <br/>\
                                                <div class="tree tree-left"></div>\
                                            </div>\
                                        </div>\
                                    </td>\
                                    <td>\
                                        <button style="width: 30px;" class="left-all btn btn-sm btn-danger"><i class="fa fa-angle-double-left"></i></button>\
                                        <br/>\
                                        <br/>\
                                        <button style="width: 30px;" class="left btn btn-sm btn-danger"><i class="fa fa-angle-left"></i></button>\
                                        <br/>\
                                        <br/>\
                                        <button style="width: 30px;" class="right btn btn-sm btn-success"><i class="fa fa-angle-right"></i></button>\
                                        <br/>\
                                        <br/>\
                                        <button style="width: 30px;" class="right-all btn btn-sm btn-success"><i class="fa fa-angle-double-right"></i></button>\
                                        <br/>\
                                    </td>\
                                    <td style="width: 45%;">\
                                        <div style="height: 100%; overflow: auto; text-align: left; margin-bottom: 0;" class="panel panel-default">\
                                            <div class="panel-body">\
                                                <input class="form-control search-right" placeholder="输入搜索内容……">\
                                                <br/>\
                                                <div class="btn-group">\
                                                    <button class="select-all btn btn-info btn-xs"><i class="fa fa-check-square"></i></button>\
                                                    <button class="de-select-all btn btn-info btn-xs"><i class="fa fa-square"></i></button>\
                                                    <button class="open-all btn btn-info btn-xs"><i class="fa fa-plus-square"></i></button>\
                                                    <button class="close-all btn btn-info btn-xs"><i class="fa fa-minus-square"></i></button>\
                                                </div>\
                                                <br/>\
                                                <br/>\
                                                <div class="tree tree-right"></div>\
                                            </div>\
                                        </div>\
                                    </td>\
                                </tr>\
                            </tbody>\
                        </table>\
                    </div>\
                    <div class="modal-footer">\
                        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>\
                        <button type="button" class="btn btn-success">提交</button>\
                    </div>\
                </div>\
              </div>\
            </div>';
                $modal = $(html);
            })();

            //init tree
            //add key up event to search input
            //add click event to move buttons
            //add click event to tree-operation buttons
            //add click event to modal buttons
            (function () {
                /**
                 * @param data [Array]necessary fields: id, pid, text
                 */
                function buildTree(data) {
                    var _data = $.extend({}, data, true);
                    function each(pid, pNode) {
                        //todo:: algorithm should be optimized
                        $.each(_data, function (index, item, arr) {
                            //when both item.id and item.pid is null, it will cause stack overflow
                            if (item.id && item["pid"] == pid) {
                                if(!item.text){
                                    console.warn("filed \"text\" is null or empty");
                                    console.log(item);
                                }

                                var cNode = {
                                    id: item.id,
                                    text: item.text,
                                    icon: item.icon,
                                    data: item,
                                    children: []
                                };

                                pNode.push(cNode);
                                each(cNode["id"], cNode.children);
                            }
                        });
                        return pNode;
                    }
                    return each(null, []);
                }

                function initTree($element, data) {
                    var pluginOpts = {
                        types : {
                            "default" : {
                                icon : options.icon
                            },
                        },
                        checkbox : {
                            keep_selected_style : true,
                        },
                        plugins : ["checkbox", "contextmenu", "search", "types", "wholerow"]
                    };
                    var instance = $element.jstree($.extend({
                        core: {
                            data: data,
                            check_callback : true
                        }
                    }, pluginOpts, true)).jstree(true);
                    return instance;
                }

                function initSearchInput(treeInstance, searcher) {
                    var flag = false;
                    searcher.keyup(function () {
                        if (flag) {
                            clearTimeout(flag);
                        }
                        flag = setTimeout(function () {
                            var v = searcher.val();
                            treeInstance.search(v.trim());
                        }, 250);
                    });
                }

                function initTreeButton($btn, callback) {
                    $btn.on("click", function () {
                        var api = $(this).parents(".panel-body").find(".tree").jstree(true);
                        callback(api);
                    })
                }

                function getSelectedIds(array) {
                    var list = [];
                    $.each(array, function (index, item, arr) {
                        if(item["isSelected"]){
                            list.push(item["id"]);
                        }
                    });
                    return list;
                }

                var $leftTree = $modal.find(".tree-left");
                var $leftSearch = $modal.find(".search-left");
                var $rightTree = $modal.find(".tree-right");
                var $rightSearch = $modal.find(".search-right");
                var $btnToLeft = $modal.find("button.left");
                var $btnToLeftAll = $modal.find("button.left-all");
                var $btnToRight = $modal.find("button.right");
                var $btnToRightAll = $modal.find("button.right-all");

                var dataLeft = buildTree(options.data);
                var dataRight = [];

                var leftTreeApi = initTree($leftTree, dataLeft);
                var rightTreeApi = initTree($rightTree, dataRight);

                //todo::
                window.leftTree = leftTreeApi;
                window.rightTree = rightTreeApi;

                initSearchInput(leftTreeApi, $leftSearch);
                initSearchInput(rightTreeApi, $rightSearch);

                initTreeButton($modal.find("button.select-all"), function (treeApi) {
                    treeApi.select_all();
                });
                initTreeButton($modal.find("button.de-select-all"), function (treeApi) {
                    treeApi.deselect_all();
                });
                initTreeButton($modal.find("button.open-all"), function (treeApi) {
                    treeApi.open_all();
                });
                initTreeButton($modal.find("button.close-all"), function (treeApi) {
                    treeApi.close_all();
                });

                function getCheckedOrSelected(treeApi) {
                    return treeApi.get_checked(true) || treeApi.get_selected(true);
                }

                function getAllNodes(treeApi) {
                    var selectedNodes = treeApi.get_selected();
                    treeApi.select_all();
                    var allNodes = treeApi.get_selected(true);
                    treeApi.deselect_all();
                    treeApi.select_node(selectedNodes);
                    return allNodes;
                }

                function getDataList(treeApi) {
                    var nodes = getAllNodes(treeApi);
                    var list = [];
                    $.each(nodes, function (index, item, array) {
                        list.push(item.data);
                    })
                    return list;
                }

                function moveNodes(treeApi, targetTreeApi, nodes) {
                    $.each(nodes, function (index, node, arr) {
                        function createNode(_node) {
                            if (!targetTreeApi.get_node(_node.parent)) {
                                createNode(treeApi.get_node(_node.parent))
                            }
                            if(!targetTreeApi.get_node(_node.id)){
                                targetTreeApi.create_node(_node.parent, {
                                    id: _node.id,
                                    text: _node.text,
                                    icon: _node.icon,
                                    data: _node.data
                                });
                            }
                        }

                        createNode(node);
                    });
                    treeApi.delete_node(nodes);
                }

                function moveSelectedToLeft() {
                    var nodes = getCheckedOrSelected(rightTreeApi);
                    moveNodes(rightTreeApi, leftTreeApi, nodes);
                }
                function moveSelectedToRight() {
                    var nodes = getCheckedOrSelected(leftTreeApi);
                    moveNodes(leftTreeApi, rightTreeApi, nodes);
                }

                $btnToLeft.on("click", function () {
                    moveSelectedToLeft();
                });
                $btnToLeftAll.on("click", function () {
                    rightTreeApi.select_all();
                    moveSelectedToLeft();
                });
                $btnToRight.on("click", function () {
                    moveSelectedToRight();
                });
                $btnToRightAll.on("click", function () {
                    leftTreeApi.select_all();
                    moveSelectedToRight();
                });

                $modal.on(EVENTS.AFTER_RENDER, function () {
                    leftTreeApi.select_node(getSelectedIds(options.data));
                    moveSelectedToRight();
                });


                //private modal api
                var _modalApi = {
                    show: function () {
                        $modal.modal("show");
                    },
                    hide: function () {
                        $modal.modal("hide");
                    }
                };

                //public modal api
                var modalApi = {
                    setTitle: function (title) {
                        $modal.find(".modal-header .modal-title").html(title);
                    },
                    destroy: function () {
                        //todo::
                    },
                    reload: function () {
                        //todo::reload tree
                    },
                    //todo:: more api here
                };

                if (options.buttons != null && options.buttons instanceof Array) {
                    $.each(options.buttons, function (item, index, array) {
                        var $btn = $('<button></button>');
                        if (item.id) {
                            $btn.attr("id", item.id);
                        }
                        $btn.addClass(item.cls ? item.cls : "btn btn-default");
                        $btn.text(item.text || "click");
                        if ($.isFunction(item.callback)) {
                            $btn.on("click", function () {
                                if (item.callback(modalApi, getDataList(rightTreeApi))){
                                    _modalApi.hide();
                                }
                            })
                        }
                    })
                } else {
                    $modal.find(".modal-footer .btn-success").click(function () {
                        if($.isFunction(options.onSubmit)){
                            if(options.onSubmit(modalApi, getDataList(rightTreeApi))){
                                _modalApi.hide()
                            }
                            return;
                        }
                        _modalApi.hide();
                    })
                }

                $modal.on('show.bs.modal', function () {
                    options.onShow(modalApi, $modal);
                });
                $modal.on('hidden.bs.modal', function () {
                    options.afterClose(modalApi, $modal);
                });
            })();

            $(document.body).append($modal);
            //todo:: append to body then trigger event but not work exactly, i don't know why, marked for the moment
            setTimeout(function () {
                $modal.trigger(EVENTS.AFTER_RENDER);
            }, 200);
            return id;
        }
        
        return function (options) {
            function load() {
                var modalId = render(_opts);

                $(this).attr("data-toggle", "modal");
                $(this).attr("data-target", "[data-modal-id=" + modalId + "]");
                isLoad = true;
            }

            var _opts = $.extend({}, DEF_CONFIG, options, true);

            if(_opts.lazyLoad){
                var isLoad = false;
                this.on("click", function () {
                    if(!isLoad){
                        load.call(this);
                    }
                });
            }else{
                load.call(this);
            }
        }
    });
})();
