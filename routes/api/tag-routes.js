const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const allTags = await Tag.findAll({
      include: [{ model: Product, attributes: ['id', 'product_name', 'price'] }],
    });
    if (allTags.length === 0) {
      res.status(404).json({ message: "Could not find tags!" });
      return;
    }
    res.status(200).json(allTags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
try{ 
const tagId = await Tag.findByPk(req.params.id, {
  include: [{ model: Product, attributes: ['id', 'product_name', 'price']}],
});
if(!tagId){
  res.status(404).json({ message: "Tag not found!" });
  return;
};
res.status(200).json(tagId);
}catch(err){
  res.status(500).json(err);
}
});

router.post('/', async (req, res) => {
  // create a new tag
try{
const { tag_name } = req.body;
const newTag = await Tag.create({ tag_name })
 res.status(201).json(newTag);
}catch(err){
  res.status(500).json(err);
}
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try{
    const tagId = req.params.id;
    const { tag_name } = req.body;

   const existingTag = await Tag.findByPk(tagId);
   if(!existingTag){
    res.status(404).json({message: "tag not found!"});
    return;
   }
   await Tag.update({ tag_name }, {
   where: {id: tagId } 
  });
  const updatedTag = await Tag.findByPk(tagId);
  res.status(200).json(updatedTag)
  }catch(err){
    res.status(500).json(err);
  }

});

router.delete('/:id', async (req, res) => {
  // delete one tag by its `id` value
  try {
    const tagId = req.params.id;
    const existingTag = await Tag.findByPk(tagId);
    if (!existingTag) {
      res.status(404).json({ message: "Tag not found!" });
      return;
    }
    await Tag.destroy({
      where: { id: tagId }
    });

    res.status(200).json({ message: "Tag deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete tag." });
  }
});

module.exports = router;
