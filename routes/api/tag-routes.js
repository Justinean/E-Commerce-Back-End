const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  const tags = await Tag.findAll();
  // be sure to include its associated Product data
  for (let i in tags) {
    const productTags = await ProductTag.findAll({where: {tag_id: tags[i].dataValues.id}});
    tags[i].dataValues.products = [];
    for (let j in productTags) {
      const product = await Product.findByPk(productTags[j].dataValues.product_id);
      delete product.dataValues.categoryId;
      tags[i].dataValues.products.push(product);
    }
  }
  res.json(tags);
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
});

router.post('/', (req, res) => {
  // create a new tag
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
