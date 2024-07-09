const asyncHandler = require("express-async-handler");
const APIError = require("../utils/apiError");
const APIFeatures = require("../utils/apiFeatures");

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) filter = req.filterObj;
    const documentsCount = await Model.countDocuments();
    const apiFeatures = new APIFeatures(Model.find(filter), req.query);
    apiFeatures
      .filter()
      .paginate(documentsCount)
      .sort()
      .limitFields()
      .search(modelName);
    const { mongooseQuery, paginationResults } = apiFeatures;

    const documents = await mongooseQuery;

    res.status(200).json({
      results: documents.length,
      paginationResults,
      data: documents,
    });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getOne = (Model, populationOptions) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (populationOptions) {
      query = query.populate(populationOptions);
    }

    const document = await query;

    if (!document) {
      return next(new APIError(`no ${Model} with this id ${id}`, 404));
    }

    res.status(200).json({
      data: document,
    });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        new APIError(`no ${Model} with this id ${req.params.id}`, 404)
      );
    }

    await document.save();
    res.status(200).json({
      data: document,
    });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    console.log(55);
    const document = await Model.findByIdAndDelete(id);
        console.log(Model);

    if (!document) {
      return next(
        new APIError(`no ${Model} with this id ${req.params.id}`, 404)
      );
    }
            console.log(77);

    await document.remove();
    res.status(204).send();
  });
