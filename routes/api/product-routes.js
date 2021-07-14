const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  const products = await Product.findAll();
  // be sure to include its associated Category and Tag data
  for (let i in products) {
    const category = await Category.findByPk(products[i].dataValues.category_id, {attributes: ['category_name']});
    products[i].dataValues.category_name = category.category_name;
    const productTags = await ProductTag.findAll({attributes: ['tag_id'], where: {product_id: products[i].id}});
    products[i].dataValues.tags = [];
    for (let j in productTags) {
      const tag = await Tag.findByPk(productTags[j].tag_id);
      products[i].dataValues.tags.push(tag);
    }
  }
  res.json(products)
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  let id = req.params.id
  const product = await Product.findByPk(id)
  // be sure to include its associated Category and Tag data
    const category = await Category.findByPk(product.dataValues.category_id, {attributes: ['category_name']});
    product.dataValues.category = category;
    const productTags = await ProductTag.findAll({attributes: ['tag_id'], where: {product_id: product.id}});
    product.dataValues.tags = [];
    for (let j in productTags) {
      const tag = await Tag.findByPk(productTags[j].tag_id);
      product.dataValues.tags.push(tag);
    }
  res.json(product)
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  let id = req.params.id;
  const product = await Product.destroy({where: {id}});
  if (product === 1) {
    res.json({message: "product deleted!"});
  } else {
    res.json({message: "product doesn't exist!"});
  }
});

module.exports = router;
