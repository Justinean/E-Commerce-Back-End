const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  const categories = await Category.findAll();
  // be sure to include its associated Products
  for (let i in categories) {
    categories[i].dataValues.products = []
    const products = await Product.findAll({where: {category_id: categories[i].id}})
    for (let j in products) {
      delete products[j].dataValues.categoryId
      categories[i].dataValues.products.push(products[j])
    }
  }
  res.json(categories)
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  let id = req.url.split("/")[req.url.split("/").length - 1];
  const categories = await Category.findAll({where: {id}})
  // be sure to include its associated Products
  categories[0].dataValues.products = []
  const products = await Product.findAll({where: {category_id: categories[0].id}})
  for (let j in products) {
    delete products[j].dataValues.categoryId
    categories[0].dataValues.products.push(products[j])
  }
  res.json(categories)
});

router.post('/', async (req, res) => {
  // create a new category
  let category_name = req.body.category_name
  const [user, created] = await Category.findOrCreate({where: {category_name}})
  if (created) {
    res.json(user)
  } else {
    res.json({message: "Category name already exists!"})
  }
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
