var Book = require('../models/book')
var Category = require('../models/category')
exports.index = function(req, res, next) {
	Category
		.find({})
		.populate({path: 'books',options: {limit:6}})
		.exec(function(err,categories){
			if(err){
				console.log(err)
			}
			res.render('index', {
				title: 'iBook 首页' ,
				categories: categories
			})
		})
}
exports.search = function(req,res,next){
	var catId = req.query.cat
	var q = req.query.q
	var page = parseInt(req.query.p, 10) || 0
	var count = 2
	var index = page*count
	if(catId){
		Category
			.find({_id:catId})
			.populate({
				path: 'books',
				select: 'title cover'
			})
			.exec(function(err,categories){
				if(err){
					console.log(err)
				}
				var category = categories[0] || {}
				var books = category.books || []
				var results = books.slice(index,index+count)
				res.render('results', {
					title: 'iBook 结果列表页面',
					keyword: category.name,
					currentPage:(page+1),
					query: 'cat=' + catId,
					totalPage: Math.ceil(books.length / count),
					books: results
				})
			})
	} else {
		Book
			.find({title:new RegExp(q+'.*','i')})
			.exec(function(err,books){
				if(err){
					console.log(err)
				}
				var results = books.slice(index,index+count)
				res.render('results', {
					title: 'iBook 结果列表页面',
					keyword: q,
					currentPage:(page+1),
					query: 'q=' + q,
					totalPage: Math.ceil(books.length / count),
					books: results
				})
			})
	}
}