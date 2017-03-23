describe("cmd test", function () {
    beforeEach(function () {
        itemSelector.clear();
    });
    
    it("test define obj", function () {
        itemSelector.define("abc", {
            a: "1",
            b: "2",
            c: "3"
        });
        itemSelector.require(["abc"], function (obj) {
            expect(obj.a).toBe("1");
            expect(obj.b).toBe("2");
            expect(obj.c).toBe("3");
        })
    });
    
    it("test define func", function () {
        itemSelector.define("abc", function () {
            return "hello" + "world";
        });
        itemSelector.require(["abc"], function (obj) {
            expect(obj).toBe("helloworld");
        })
    });
    
    it("test define singleton", function () {
        itemSelector.define("singleton", function () {
            var count = 1 ;
            return {
                plus: function () {
                    return ++count;
                }
            }
        });
        itemSelector.require(["singleton"], function (singleton) {
            expect(singleton.plus()).toBe(2);
        });
        itemSelector.require(["singleton"], function (singleton) {
            expect(singleton.plus()).toBe(3);
        });
    });

    it("test require", function () {
        itemSelector.define("abc", function () {
            return {
                getStr: function () {
                    return "hello world";
                }
            }
        });
        var module = itemSelector.require("abc");
        expect(module.getStr()).toBe("hello world");
    });

    it("test clear", function () {
        itemSelector.define("abc", "123");
        itemSelector.require(["abc"], function (obj) {
            expect(obj).toBe("123");
        });
        itemSelector.clear();
        itemSelector.require(["abc"], function (obj) {
            expect(obj).toBe(undefined);
        });
    });
});