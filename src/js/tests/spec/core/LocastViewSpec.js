// LocastViewSpec.js
// 

define(['core/LocastView', 'core/LocastState'], function(LocastView, LocastState) {

    describe("LocastView", function() {
   
        var testView, baseStateSpy, viewStateASpy, viewStateBSpy;

        beforeEach(function() {
            baseStateSpy = jasmine.createSpy("baseState enter");
            viewStateASpy = jasmine.createSpy("viewStateA enter");
            viewStateBSpy = jasmine.createSpy("viewStateB exit");
            
            testView = LocastView.extend({
                baseState: {
                    enter: baseStateSpy
                },

                viewStates: {
                    viewStateA: { 
                        enter: viewStateASpy
                    },
                    
                    viewStateB: { 
                        exit: viewStateBSpy    
                    },
                }
            });
        });

       describe('#addViewStates', function(){  

            it("should add states to the view", function() {
                var thisView =  new testView;
                thisView.addViewStates(thisView.viewStates);
               
                expect(thisView.states['viewStateA'] instanceof LocastState).toBeTruthy(); 
                expect(thisView.states['viewStateB'] instanceof LocastState).toBeTruthy();  
            });

            it("should add states which inherit from the view #baseState", function() {
                var thisView =  new testView;
                thisView.addViewStates(thisView.viewStates);
 
                thisView.setViewState(thisView.states['viewStateB']);

                expect(baseStateSpy).toHaveBeenCalled();   
            });

            it("should add states which can override the view #baseState", function() {
                var thisView =  new testView;
                thisView.addViewStates(thisView.viewStates);
 
                thisView.setViewState(thisView.states['viewStateA']);

                expect(viewStateASpy).toHaveBeenCalled();   
            });
            
            it("should add states in which state#owner references the view", function() {
                var thisView =  new testView;
                thisView.addViewStates(thisView.viewStates);
 
                expect(thisView.states['viewStateA'].owner).toEqual(thisView);

            });
        });
        
        describe('#setViewState', function () {
        
           it("should change the view state", function() {
                var thisView =  new testView;
                thisView.addViewStates(thisView.viewStates);
                             
                thisView.setViewState(thisView.states['viewStateA']); 
                expect(thisView.state).toEqual(thisView.states['viewStateA']);
                
                thisView.setViewState(thisView.states['viewStateB']);
                expect(thisView.state).toEqual(thisView.states['viewStateB']);                  
                //expect(viewStateBSpy).toHaveBeenCalled();
                //expect(viewStateASpy).toHaveBeenCalled();  
 
            }); 
 
            it("should trigger state#enter and state#exit", function() {
                var thisView =  new testView;
                thisView.addViewStates(thisView.viewStates);
                             
                thisView.setViewState(thisView.states['viewStateB']);
                thisView.setViewState(thisView.states['viewStateA']); 
                
                expect(viewStateBSpy).toHaveBeenCalled();
                expect(viewStateASpy).toHaveBeenCalled();  
 
            }); 
        
        });

    });
});



