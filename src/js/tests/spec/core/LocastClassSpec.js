// LocastClassSpec.js
// spec based on leaflet class spec https://github.com/CloudMade/Leaflet/blob/master/spec/suites/core/ClassSpec.js

define(['core/LocastClass'], function(Class) {

    describe("LocastClass", function() {
   
       describe('#extend', function(){ 
            var testClass, constructor, method;

            beforeEach(function() {
                constructor = jasmine.createSpy("testClass constructor");
                method = jasmine.createSpy("testClass#bar method");
                
                testClass = Class.extend({
                    initialize: constructor,
                    foo: 5,
                    bar: method
                });
            });

            it("should create a class with the given constructor and properties", function() {
                var a = new testClass();

                expect(constructor).toHaveBeenCalled();
                expect(a.foo).toEqual(5);

                a.bar();

                expect(method).toHaveBeenCalled();
            
            });

            it("should inherit parent classes' constructor & properties", function(){
                var testClass2 = testClass.extend({baz:2});

                var b = new testClass2;

                expect(b instanceof testClass).toBeTruthy();
                expect(b instanceof testClass2).toBeTruthy();

                expect(constructor).toHaveBeenCalled();
                expect(b.baz).toEqual(2);

                b.bar();

                expect(method).toHaveBeenCalled();
            });

        });
    });
});



