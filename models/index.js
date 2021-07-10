// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category);
// Categories have many Products
Category.hasMany(Product, {foreignKey: 'id'});
// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {through: ProductTag});
Tag.hasMany(Product, {foreignKey: 'id'});
// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {through: ProductTag});
Product.hasMany(Tag);

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
