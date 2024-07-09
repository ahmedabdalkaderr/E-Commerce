const SubCategory = require("../models/subCategoryModel");
const factory = require("./handlersFactory");

exports.createFilterObject = (req,res,next) =>{
  const filterObj = {};
  if(req.params.categoryId) filterObj.category = req.params.categoryId;
  req.filterObj = filterObj; 
  next();
}

exports.getSubCategories = factory.getAll(SubCategory);
exports.createSubCateogry = factory.createOne(SubCategory);
exports.getSubCategory = factory.getOne(SubCategory);
exports.updateSubCategory = factory.updateOne(SubCategory);
exports.deleteSubCategory = factory.deleteOne(SubCategory);
