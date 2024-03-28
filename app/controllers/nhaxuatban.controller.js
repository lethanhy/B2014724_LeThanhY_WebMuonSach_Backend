const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const NhaxuatbanService = require("../services/nhaxuatban.service");


exports.create = async (req, res, next) => {
    if (!req.body?.ten) {
        return next(new ApiError(400, "Name can not be empty"));
    
    }
    try {
        const nhaxuatbanService = new NhaxuatbanService(MongoDB.client);
        const document = await nhaxuatbanService.create(req.body); 
        return res.send(document);

    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the contact")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const nhaxuatbanService = new NhaxuatbanService(MongoDB.client);
        const { ten } = req.query;
        if (ten) {
            documents = await nhaxuatbanService.findByName(ten);
        } else {
            documents = await nhaxuatbanService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving contacts")
        );
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const nhaxuatbanService = new NhaxuatbanService(MongoDB.client);
        const document = await nhaxuatbanService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Đoc giả không có"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Error retrieving contact with id=${req.params.id}`
            )
        );
    }
};

//Update a contact by the id in the request
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const nhaxuatbanService = new NhaxuatbanService(MongoDB.client);
        const document = await nhaxuatbanService.update(req.params.id, req.body);
        if (!document) {
            return res.send({message: "Contact was updated successfully" });
        }
        return next(new ApiError(404, "Contact not found"));
    } catch (error) {
        return next(
            new ApiError(500, `Error updating contact with id=${req.params.id}`)
        );
    }
};

//Delete a contact with the specified id in the request
exports.delete = async (req, res, next) => {
    try {
        const nhaxuatbanService = new NhaxuatbanService(MongoDB.client);
        const document = await nhaxuatbanService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404,"Contact was deleted successfully" ));
        }
        return res.send({ message:"Contact not found" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Could not delete contact with id=${req.params.id}`
            )
        );
    }
}

// Delete all contacts of user from the database
exports.deleteAll = async (_req, res, next) => {
    try {
        const nhaxuatbanService = new NhaxuatbanService(MongoDB.client);
        const deletedCount = await nhaxuatbanService.deleteAll();
        return res.send({
            message: `${deletedCount} contacts were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing all contacts")
        );
    }
};

// Find all favorite contacts of user
exports.findAllFavorite = async (_req, res, next) => {
    try {
        const nhaxuatbanService = new NhaxuatbanService(MongoDB.client);
        const documents = await nhaxuatbanService.findFavorite();
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(
                500,
                "An error occurred while rtrieving favorite contacts"
            )
        );
    }
}



