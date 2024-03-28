const { ObjectId } = require("mongodb");

class SachService {
    constructor(client) {
        this.Sach = client.db().collection("sach");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractSachData(payload) {
        const sach = {
            tensach: payload.tensach,
            dongia: payload.dongia,
            soquyen: payload.soquyen,
            maNXB: payload.maNXB,
            tacgia: payload.tacgia,
        };
        
         
        //Remove undefined fields
        Object.keys(sach).forEach(
            (key) => sach[key] === undefined && delete sach[key]
        );console.log('thành công')
        return sach;
        
    }

    async create(payload) {
        const sach = this.extractSachData(payload);
        const result = await this.Sach.findOneAndUpdate(
            sach,
            { $set: sach },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }


    async find(filter) {
        const cursor = await this.Sach.find(filter);
        return await cursor.toArray();
    }

    async findByName(ten) {
        return await this.find({
            ten: { $regex: new RegExp(ten), $options: "i"},
        });
    }

    async findById(id) {
        return await this.Sach.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractSachData(payload);
        const result = await this.Sach.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after"}
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.Sach.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }

    async findFavorite() {
        return await this.find({ favorite: true });
    }

    async deleteAll() {
        const result = await this.Sach.deleteMany({});
        return result.deletedCount;
    }

}
module.exports = SachService;