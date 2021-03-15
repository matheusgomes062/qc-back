module.exports = (mongoose, mongoosePaginate) => {
  var schema = mongoose.Schema(
    {
      nome: String,
      password: String,
      email: String
    },
    { timestamps: true }
  );

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  schema.plugin(mongoosePaginate);

  const Client = mongoose.model('client', schema);
  return Client;
};
