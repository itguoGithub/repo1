/**
 * 
 */
package com.pinyougou.cart.service;

import java.util.List;

import com.pinyougou.pojogroup.Cart;

//购物车
public interface CartService {

	//添加商品到购物车
 public List<Cart>  addGoodsToCartList(List<Cart> cartList,Long itemId,Integer num );
 

   //从redis中查询购物车
    public List<Cart> findCartListFromRedis(String username);
 
    //将购物车保存到redis
    public void saveCartListToRedis(String username,List<Cart>cartList);
    
    //合并购物车
    public List<Cart> mergeCartList(List<Cart> cartList1,List<Cart> cartList2);
}
