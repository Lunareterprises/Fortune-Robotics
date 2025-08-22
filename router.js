var express =require('express')
var route = express.Router()

let{AddBannerVideo,listBanner,DeleteBanner}=require('./controller/Banner')
route.post('/add/banner',AddBannerVideo)
route.post('/list/banner',listBanner)
route.post('/delete/banner',DeleteBanner)

let{AddaddTestimonial,listTestimonial,DeleteTestimonial,EditTestimonial}=require('./controller/Testimonials')
route.post('/add/testimonial',AddaddTestimonial)
route.post('/list/testimonial',listTestimonial)
route.post('/edit/testimonial',EditTestimonial)
route.post('/delete/testimonial',DeleteTestimonial)

let{AddProduct,listProduct,DeleteProduct,EditProduct}=require('./controller/products')
route.post('/add/product',AddProduct)
route.post('/list/product',listProduct)
route.post('/edit/product',EditProduct)
route.post('/delete/product',DeleteProduct)

let{ContactUs,listcontact,deletecontact}=require('./controller/contact')
route.post('/add/contactus',ContactUs)
route.post('/list/contactus',listcontact)
route.post('/delete/contactus',deletecontact)

let{AddBlog,listBlog,EditBlog,DeleteBlog}=require('./controller/Blog')
route.post('/add/blog',AddBlog)
route.post('/list/blog',listBlog)
route.post('/edit/blog',EditBlog)
route.post('/delete/blog',DeleteBlog)

module.exports = route


