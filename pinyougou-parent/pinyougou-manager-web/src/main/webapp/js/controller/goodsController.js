 //控制层 
app.controller('goodsController' ,function($scope,$controller, $location, itemCatService ,goodsService){	
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		goodsService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		goodsService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(){
		var id = $location.search()['id'];//获取参数值(用于静态页面之间的跳转获取)
		if(id==null) {
			return ;
		}
		goodsService.findOne(id).success(
			function(response){
				$scope.entity= response;//response就是后台返回的goods
				//向富文本编辑器中添加商品介绍
				editor.html($scope.entity.goodsDesc.introduction);
				//显示图片列表
				$scope.entity.goodsDesc.itemImages=JSON.parse($scope.entity.goodsDesc.itemImages);
				//显示扩展属性
				$scope.entity.goodsDesc.customAttributeItems=JSON.parse($scope.entity.goodsDesc.customAttributeItems);
				//显示规格(是否勾选用的)
				$scope.entity.goodsDesc.specificationItems=JSON.parse($scope.entity.goodsDesc.specificationItems);
				//显示规格列表数据
				for (var i = 0; i < $scope.entity.itemList.length; i++) {
					$scope.entity.itemList[i].spec = JSON.parse($scope.entity.itemList[i].spec);
				}
			}
		);				
	}
	
	//根据查询的数据判断规格选项是否应该被勾选
	$scope.checkAttributeValue = function(specName,optionName) {
		var items=$scope.entity.goodsDesc.specificationItems;
		var object = $scope.searchObjectByKey(items,'attributeName',specName);
		if (object==null) {
			return false;
		}else {
			if (object.attributeValue.indexOf(optionName)>=0) {
				return true;
			}else {
				return false;
			}
		}
	}
	
	
	
	
	
	//保存 
	$scope.save=function(){				
		var serviceObject;//服务层对象  				
		if($scope.entity.id!=null){//如果有ID
			serviceObject=goodsService.update( $scope.entity ); //修改  
		}else{
			serviceObject=goodsService.add( $scope.entity  );//增加 
		}				
		serviceObject.success(
			function(response){
				if(response.success){
					//重新查询 
		        	$scope.reloadList();//重新加载
				}else{
					alert(response.message);
				}
			}		
		);				
	}
	

	 
	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框			
		goodsService.dele( $scope.selectIds ).success(
			function(response){
				if(response.success){
					$scope.reloadList();//刷新列表
					$scope.selectIds=[];
				}						
			}		
		);				
	}
	
	$scope.searchEntity={};//定义搜索对象 
	
	//搜索
	$scope.search=function(page,rows){			
		goodsService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//设置状态的值得数组
	$scope.status=["未审核","审核通过","审核未通过","已关闭"];
	
	$scope.itemCatList=[];//商品分类列表
	$scope.findItemCatList = function() {
		itemCatService.findAll().success(
		function(response) {
			for (var i = 0; i < response.length; i++) {
				$scope.itemCatList[response[i].id] = response[i].name;
			}
		}		
		);
	}
	
	$scope.entity={goods:{},goodsDesc:{itemImages:[],specificationItems:[]}};
	//读取一级分类
	$scope.selectItemCat1List=function() {
		itemCatService.findByParentId(0).success(
		function(response) {
			$scope.itemCat1List=response;
		}		
		);
	}
	
	//读取二级分类,监视一级分类的变化
	$scope.$watch('entity.goods.category1Id',function(newValue,oldValue) {
		//根据一级分类选择的值,查询二级分类
		itemCatService.findByParentId(newValue).success(
		function(response) {
			$scope.itemCat2List=response;
			}		
		);
	});
	
	//读取三级分类,监视二级分类
	$scope.$watch('entity.goods.category2Id',function(newValue,oldValue) {
		//根据二级分类选择的值,查询三级分类
		itemCatService.findByParentId(newValue).success(
		function(response) {
			$scope.itemCat3List=response;
			}		
		);
	});
	
	//读取模板id,监视三级分类
	$scope.$watch('entity.goods.category3Id',function(newValue,oldValue) {
		//根据三级分类选择的值,查询模板id
		itemCatService.findOne(newValue).success(
		function(response) {
			$scope.entity.goods.typeTemplateId=response.typeId;//更新模板Id
		}		
		);
	});
	
	//读取品牌列表,监视模板id
	$scope.$watch('entity.goods.typeTemplateId',function(newValue,oldValue) {
		//根据模板id查询品牌列表
		typeTemplateService.findOne(newValue).success(
		function(response) {
			$scope.typeTemplate=response;//获取类型模板
			$scope.typeTemplate.brandIds=JSON.parse($scope.typeTemplate.brandIds);//把品牌列表JSON串成对象
			if($location.search()['id']==null){//是新增
			$scope.entity.goodsDesc.customAttributeItems=JSON.parse($scope.typeTemplate.customAttributeItems);//把类型模板的扩展属性赋值给goodsDesc的扩展属性
				}		
			}
		);
		//查询规格列表
		typeTemplateService.findSpecList(newValue).success(
		function(response) {
			$scope.specList=response;
			}		
		);
	});
	//更新审核状态
	$scope.updateStatus=function(status) {
		goodsService.updateStatus($scope.selectIds,status).success(
				function(response) {
					if (response.success) {
						$scope.reloadList();//刷新列表
						$scope.selectIds=[];//清空selectIds集合
					}else {
						alert(response.message);
					}
				}
		);
	}
    
});	
