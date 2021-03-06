package com.itheima.ssm.controller;

import com.itheima.ssm.domain.Product;
import com.itheima.ssm.service.IProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;


@Controller
@RequestMapping("/product")
public class ProductController {
    @Autowired
    private IProductService productService;


   //查询全部产品
    @RequestMapping("/findAll")
    public ModelAndView findAll() throws Exception {
        ModelAndView mv = new ModelAndView();
        List<Product> list = productService.findAll();
        mv.addObject("productList",list);
        mv.setViewName("product-list1");
          return mv;

        }


        //产品添加
    @RequestMapping("/save")
    public String  save(Product product) throws Exception {
        productService.save(product);
        return "redirect:findAll";
    }






/*-------------------------------------------------------*/

    @RequestMapping("/test")
    public String test(){
        System.out.println("测试");

        return "success";
    }

    @RequestMapping("/testFindById")
    public String findById(Model model){
        Product product = productService.findByNum("itcast-002");

        model.addAttribute("product",product);
        System.out.println("product = " + product);
        return "success";
    }



}
