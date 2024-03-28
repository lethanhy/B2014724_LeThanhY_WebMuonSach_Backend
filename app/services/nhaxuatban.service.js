const { ObjectId } = require("mongodb");

class NhaxuatbanService {
    constructor(client) {
        this.Nhaxuatban = client.db().collection("nhaxuatban");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractNhaxuatbanData(payload) {
        const nhaxuatban = {
            ten: payload.ten,
            diachi: payload.diachi,
            
        };
        
         
        //Remove undefined fields
        Object.keys(nhaxuatban).forEach(
            (key) => nhaxuatban[key] === undefined && delete nhaxuatban[key]
        );console.log('thành công')
        return nhaxuatban;
        
    }

    async create(payload) {
        const nhaxuatban = this.extractNhaxuatbanData(payload);
        const result = await this.Nhaxuatban.findOneAndUpdate(
            nhaxuatban,
            { $set: nhaxuatban },
            { returnDocument: "after", upsert: true }
        );console.log('thành công')
        return result.value;
    }


    async find(filter) {
        const cursor = await this.Nhaxuatban.find(filter);
        return await cursor.toArray();
    }

    async findByName(ten) {
        return await this.find({
            ten: { $regex: new RegExp(ten), $options: "i"},
        });
    }

    async findById(id) {
        return await this.Nhaxuatban.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractNhaxuatbanData(payload);
        const result = await this.Nhaxuatban.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after"}
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.Nhaxuatban.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }

    async findFavorite() {
        return await this.find({ favorite: true });
    }

    async deleteAll() {
        const result = await this.Nhaxuatban.deleteMany({});
        return result.deletedCount;
    }

}
module.exports = NhaxuatbanService;