class BaseController {
  model;
  constructor(model) {
    this.model = model;
    console.log("🟠 model - ", model);
  }

  async createOne(payload) {
    const data = await this.model.create(payload);
    return data;
  }

  async findAll() {
    const data = await this.model.findAll({
      attributes: {
        exclude: ["password"],
      },
      include: this.includes,
      order: [["createdAt", "DESC"]],
    });
    return data;
  }

  async findOne(id) {
    const data = await this.model.findOne({
      where: { id: id },
      attributes: {
        exclude: ["password"],
      },
      include: this.includes,
      order: this.orders,
    });
    return data;
  }

  async updateOne(id, payload) {
    const data = await this.model.update(payload, {
      where: { id: id },
    });
    return data;
  }

  async deleteOne(id) {
    const data = await await this.model.destroy({ where: { id: id } });
    return data;
  }
}

module.exports = BaseController;
