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

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  let id = req.params.id;
  const tag = await Tag.findByPk(id)
  const productTags = await ProductTag.findAll({where: {tag_id: tag.dataValues.id}});
    tag.dataValues.products = [];
    for (let j in productTags) {
      const product = await Product.findByPk(productTags[j].dataValues.product_id);
      delete product.dataValues.categoryId;
      tag.dataValues.products.push(product);
    }
  // be sure to include its associated Product data
  res.json(tag)
});

router.post('/', async (req, res) => {
  // create a new tag
  let tag_name = req.body.tag_name
  const [tag, created] = await Tag.findOrCreate({where: {tag_name}})
  if (created) {
    res.status(200).json(tag)
  } else {
    res.status(400).json({message: "Tag name already exists!"})
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  let id = req.params.id;
  await Tag.update({tag_name: req.body.tag_name}, {where: {id}});
  const tag = await Tag.findByPk(id);
  const productTags = await ProductTag.findAll({where: {tag_id: tag.dataValues.id}});
    tag.dataValues.products = [];
    for (let j in productTags) {
      const product = await Product.findByPk(productTags[j].dataValues.product_id);
      delete product.dataValues.categoryId;
      tag.dataValues.products.push(product);
    }
  // be sure to include its associated Product data
  res.json(tag);
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  let id = req.params.id;
  const tag = await Tag.destroy({where: {id}});
  if (tag === 1) {
    res.json({message: "Tag deleted!"});
  } else {
    res.json({message: "Tag doesn't exist!"});
  }
});

module.exports = router;
