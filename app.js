// BUDGET CONTROLLER
var budgetController=(function(){
	var Expense=function(id,description,value){
		this.id=id;
		this.description=description;
		this.value=value;
	};
	var Income=function(id,description,value){
		this.id=id;
		this.description=description;
		this.value=value;
	};
	var data={
		allItems:{
		exp:[],
		inc:[]
		},
		totals:{
			exp:0,
			inc:0
		}
	}
	// RETURNS A NEW ITEM THAT WILL EITHER BE AN 'Expense' OBJECT OR AN 'Income' OBJECT.
	return {
			addItem:function(type,des,val){
			if (data.allItems[type].length>0){
				ID=data.allItems[type][data.allItems[type].length-1].id+1;
			}
			
			else{
				ID=0;
			}
			
			if (type=='exp'){
				var newItem=new Expense(ID,des,val);
				
				
			}
			else if(type=='inc'){
				var newItem=new Income(ID,des,val);
			}
			//data.totals[type]+=val;
			data.allItems[type].push(newItem)
			return newItem;
		},
		file:function(){
			return data.allItems;
		},
		removeItem:function(type,ID){ //type will be "exp" or "inc"
			for (let i=0;i<data.allItems[type].length;i++){
				if (data.allItems[type][i].id==ID){
					data.allItems[type].splice(i,1)
				}
			}
		}
		
			
	}

})()
			
			
			




// UI CONTROLLER************************************************************************
var UIController=(function(){
		var DOMstrings={
			inputType:'.add_type',
			description:'.add_description',
			addValue:'.add__value',
			inputBtn:'.add__btn',
			incomeContainer:'.income__list',
			expensesContainer:'.expenses__list',
			incomeValue:'.budget_income_value',
			expenseValue:'.budget_expenses_value',
			budgetValue:'.budget_value',
			budgetPercent:'.budget_expenses_percentage',
			container:'.container',
			date:'.budget__title__month'
		}
		// RETURNS AN OBJECT 'getInput' HAVING TYPE, DESCRIPTION AND VALUE
		return{
			getInput:function(){
				return { 
				type:document.querySelector(DOMstrings.inputType).value,// either 'exp' or 'inc'
				description:document.querySelector(DOMstrings.description).value,
				value:document.querySelector(DOMstrings.addValue).value
				}
			},
			getDOMStrings:function(){
				return DOMstrings;
			},
			addListItem:function(obj,type){
				
					var html,newHtml,elem;
					if (type=='inc'){
					elem=DOMstrings.incomeContainer;
					html='<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete__btn">del</button></div></div></div>'
					}
					
					else if (type=='exp'){
					elem=DOMstrings.expensesContainer;
					html='<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete__btn">del</button></div></div></div>'
					}
					newHtml=html.replace('%id%',obj.id)
					newHtml=newHtml.replace('%description%',obj.description)
					newHtml=newHtml.replace('%value%',obj.value)
					document.querySelector(elem).insertAdjacentHTML('beforeend',newHtml)
					
			},
			update:function(objUI){			//UPGRADES THE INCOME OR EXPENSE VALUE
				var str,sum,oldie,new_num,net;

				if (objUI.type=='inc'){
					//gain=document.querySelector('.budget_income_value').innerHTML;
					oldie=parseFloat(document.querySelector(DOMstrings.incomeValue).innerHTML);
					new_num=parseFloat(objUI.value);
					sum=oldie+new_num;
					document.querySelector(DOMstrings.incomeValue).innerHTML=sum.toString();
				}
				else if (objUI.type='exp'){
					oldie=parseFloat(document.querySelector(DOMstrings.expenseValue).innerHTML);
					new_num=parseFloat(objUI.value);
					sum=oldie-new_num
					document.querySelector(DOMstrings.expenseValue).innerHTML=sum.toString();
				}
					
			},
			upgradeBudget:function(){		//UPGRADES THE BUDGET VALUE AND THE PERCENTAGE VALUE
					var budget,pos,neg,fraction;//'pos' stands for income and 'neg' stands for expenses
					budget=parseFloat(document.querySelector(DOMstrings.budgetValue).innerHTML);
					
					fraction=parseFloat(document.querySelector(DOMstrings.budgetPercent).innerHTML);
					pos=parseFloat(document.querySelector(DOMstrings.incomeValue).innerHTML);
					neg=parseFloat(document.querySelector(DOMstrings.expenseValue).innerHTML);
					budget=pos+neg;
					fraction=((-neg/pos)*100).toFixed(2);
					document.querySelector(DOMstrings.budgetValue).innerHTML=budget.toString(); 
					document.querySelector(DOMstrings.budgetPercent).innerHTML=fraction.toString()+'%';
					
				},
			removeFromUI:function(selectorID){
				document.getElementById(selectorID).parentNode.removeChild(document.getElementById(selectorID));
			},	
			dateLabel:function(){
			var d,list,month;
			d=new Date();
			list=['January','febuary','March','April','May','June','August','September','October','November','December'];
			month=list[d.getMonth()-1]
			document.querySelector(DOMstrings.date).textContent=month;
				
			},
			clearFields:function(){
				document.querySelector(DOMstrings.description).value='';
				document.querySelector(DOMstrings.addValue).value='';
			}
		}
})()

// GLOBAL APP CONTROLLER*************************************************************
var controller=(function(budgetCtrl,UICtrl){
		var DOM=UICtrl.getDOMStrings();
		var getEventListeners=function(){
			
			
			document.querySelector(DOM.inputBtn).addEventListener('click',function(){
			return ctrlAddItem();
			});
			
			document.addEventListener('keypress',function(event){
			if (event.keycode==13||event.which==13){
				return ctrlAddItem();
				}	
			});
			
			document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
		};
		
		var ctrlAddItem=function(){	//LOGS THE OBJECT RETURNED BY THE UIController AFTER NAMING IT 'input'
			var input=UICtrl.getInput();
			console.log(input);
			if (input.value!=0){
			var item=budgetCtrl.addItem(input.type,input.description,input.value);
			//console.log(item)
			UICtrl.update(input);
			UICtrl.addListItem(item,input.type);
			UICtrl.upgradeBudget();
			UICtrl.clearFields();
			}
		}
			
		var ctrlDeleteItem=function(event){	//removes the item and then upgrade the income,expense,budget and percentage
			var itemID,dic,delObj,kind,oldInc,OldExp,bgt,oldPercent;
			itemID=event.target.parentNode.parentNode.parentNode.id
			if(itemID){
			
				digit=itemID[itemID.length-1] // CAN BE 0,1,2,3...
				kind=itemID.slice(0,3)
				dic=(budgetCtrl.file());
				delObj= {
					type:kind,
					value:dic[kind][digit].value,
					id:digit
				}
				
			
			bgt=parseFloat(document.querySelector(DOM.budgetValue).innerHTML)
			
			if (delObj.type=='inc'){
				delObj.value=parseFloat(delObj.value)
				bgt-=delObj.value;
				document.querySelector(DOM.budgetValue).innerHTML=bgt.toString();
				oldInc=parseFloat(document.querySelector(DOM.incomeValue).innerHTML);
				oldInc-=delObj.value;
				oldPercent=(((oldInc-bgt)/oldInc)*100).toFixed(2);
				document.querySelector(DOM.incomeValue).innerHTML=oldInc.toString();
				document.querySelector(DOM.budgetPercent).innerHTML=oldPercent.toString()+'%';
			}
			
			else if (delObj.type=='exp'){
				delObj.value=parseFloat(delObj.value)
				bgt+=delObj.value;
				document.querySelector(DOM.budgetValue).innerHTML=bgt.toString();
				oldExp=parseFloat(document.querySelector(DOM.expenseValue).innerHTML);
				oldExp+=delObj.value;//"oldExp" have a negative sign
				oldPercent=((-oldExp/(bgt-oldExp))*100).toFixed(2);
				document.querySelector(DOM.expenseValue).innerHTML=oldExp.toString();
				//console.log(oldExp);
				document.querySelector(DOM.budgetPercent).innerHTML=oldPercent.toString()+'%';
			}
			
			budgetCtrl.removeItem(delObj.type,delObj.id)// REMOVE ITEMS FROM DATA STRUCTURE
			UICtrl.removeFromUI(itemID)
			}
		}	
			
			
			
				
			
		
		
		
		
	
		
		//2.Add item to the budget Controller
		
		//3. add the item to the UI
		
		//4.Calculate the budget
			
		//5.Display the budget
		return {
			init:function(){
				console.log('Application has started');
				UICtrl.dateLabel();
				getEventListeners();
				
			}
			
		}
	})(budgetController,UIController);
	
controller.init();	

	
	
	
	
		
		
		
		


		
	
		
		

		 
		 

	


