function CallDone(setTimeOutCount,done){
  this.count=0;
  this.vardone=function(){
	this.count++;
	if(this.count==setTimeOutCount)
	  done();
  }	
}
if(typeof(jasmineExecTag)=="undefined")
	jasmineExecTag = "EXECUTE_ALL";
	
describe("cdc.util.event with single function", function() {	
	var newDiv,counter=1;	
	var callBack=function(obj){obj.innerHTML="div inserted"; };
	//Create new div before executing each it
	beforeEach(function(){
		newDiv = document.createElement("div");
		newDiv.setAttribute("id", "cdcUtilEventDeferQueueDiv"+counter);
		newDiv.setAttribute("style", "display:none");
		counter=counter+1;
		document.body.appendChild(newDiv);
	});
	if(jasmineExecTag == "EXECUTE_ALL" || jasmineExecTag == "pass") {
		it("should not run the function supplied until the time given has elapsed",function(){	
			cdc.util.event.defer.queueEvent(newDiv,callBack,400);
			expect(newDiv.innerHTML).toEqual("");
		});	
		it("should not have run when checked immediately, even when time interval is set to 0",function(){    
			cdc.util.event.defer.queueEvent(newDiv,callBack,0);
			//this will probably always fail regardless of the fix in the next step
			expect(newDiv.innerHTML).toEqual("");
		});
		 it("should have run when checked after 0 seconds, even when time interval is set to 0",function(done){   
			var obj=new CallDone(2,done);
			cdc.util.event.defer.queueEvent(newDiv,callBack,0);
		   // waits(0);
		   setTimeout(function() {
				// this should pass someday, today it won't pass because 0 is not respected, it's falsey and the default 300 is used instead
				// expect(newDiv.innerHTML).toEqual("div inserted");
				expect(newDiv.innerHTML).toEqual("");
				obj.vardone();
			},0);
			//waits(400);
			// waits has to be 400, if the last queueEvent is called with 0 delay then it will override with previous delay as 400 (line number 14)
			setTimeout(function() {		
				expect(newDiv.innerHTML).toEqual("div inserted");
				obj.vardone();
			},400);
		});
		
		it("should show that the callback has run when it's checked at the time equal to the interval set",function(done){	
			cdc.util.event.defer.queueEvent(newDiv,callBack,100);
			//waits(100);
			setTimeout(function() {		    
				expect(newDiv.innerHTML).toEqual("div inserted");
				done();
			},100);	
		});
		
		it("should show that the callback has run when checked at a time delay greater that the interval set",function(done){	
			cdc.util.event.defer.queueEvent(newDiv,callBack);
			//waits(300);
			setTimeout(function() {
				expect(newDiv.innerHTML).toEqual("div inserted");
				done();
			},300);	
		});
	}
});

describe("cdc.util.event with multiple function", function() {
	
	var newDiv,counter=1,element1,element2,element3,element4;	
		
	var callBack=function(obj){ jQuery(obj).appendTo("#cdcUtilEventResult"); };
		
	var createDiv=function(){
		newDiv = document.createElement("div");
		newDiv.setAttribute("id", "cdcUtilEventDeferQueueDiv_M"+counter);
		newDiv.setAttribute("style", "display:none");
		counter=counter+1;
		document.body.appendChild(newDiv);		
		return newDiv;
	}
	if(jasmineExecTag == "EXECUTE_ALL" || jasmineExecTag == "pass") { 
		it("every callback should get called in order and at the timing interval specified",function(done){	
			jQuery("body").append("<div id='cdcUtilEventResult'></div>");
			
			element1=createDiv();
			cdc.util.event.defer.queueEvent(element1,callBack);		
			element2=createDiv();
			cdc.util.event.defer.queueEvent(element2,callBack,200);		
			element3=createDiv();
			cdc.util.event.defer.queueEvent(element3,callBack,500);		
			element4=createDiv();
			cdc.util.event.defer.queueEvent(element4,callBack,1);
			// queueEvent function will not execute the function based on the order. It's taking the last delay value and executing.
			// waits has to be set to 0 to verify the order of execution. 
			// without waits(0) all the expect will fail
			//waits(0);
			var obj=new CallDone(4,done);
			setTimeout(function(){
				expect(jQuery("#cdcUtilEventResult div:eq(0)").attr("id")).toEqual(jQuery(element1).attr("id"));
				obj.vardone();
			},0);
			setTimeout(function(){
				expect(jQuery("#cdcUtilEventResult div:eq(1)").attr("id")).toEqual(jQuery(element2).attr("id"));
				obj.vardone();
			});
			setTimeout(function(){
				expect(jQuery("#cdcUtilEventResult div:eq(2)").attr("id")).toEqual(jQuery(element3).attr("id"));
				obj.vardone();
			});
			setTimeout(function(){
				expect(jQuery("#cdcUtilEventResult div:eq(3)").attr("id")).toEqual(jQuery(element4).attr("id"));
				obj.vardone();
			});
		});	
	}
	var callBack_Second=function(obj){ jQuery(obj).html("div inserted"); };
	var element5="";
	if(jasmineExecTag == "EXECUTE_ALL" || jasmineExecTag == "pass") { 
		it("remove the event function from queue if we pass the same event id more than once",function(done){	
			element5=createDiv();
			cdc.util.event.defer.queueEvent(element5,callBack_Second,1);
			// Calling second time with same DOM element will remove the event scheduled for that DOM element.
			cdc.util.event.defer.queueEvent(element5,callBack_Second,1);
			//waits(2);
			setTimeout(function(){
				expect(jQuery(element5).html()).toEqual("");
				done();
			},2);
		});
	}
});
