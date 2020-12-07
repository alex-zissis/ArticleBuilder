const {Article} = require('../../db/Article');
const {Router} = require('express');

const ArticleRouter = Router();

ArticleRouter.get('/', async (req, res) => {
    const articles = await Article.find({}).exec();

    res.json(articles);
});

ArticleRouter.post('/', (req, res) => {
    const {title, content} = req.body;

    const a = new Article({title, content});
    a.save((err, article) => {
        console.log(article);
        console.log(err);
        res.json({...article._doc});
    });
});

ArticleRouter.get('/:id', async (req, res) => {
    const {id} = req.params;

    const a = await Article.findById(id)
        .exec()
        .catch((err) => console.log(err));

    if (!a) {
        return res.status(400).json({status: 'bad'});
    }

    return res.json({...a._doc});
});

ArticleRouter.delete('/:id', async (req, res) => {
    const {id} = req.params;

    const a = await Article.findByIdAndDelete(id)
        .exec()
        .catch((err) => console.log(err));

    if (!a) {
        return res.status(400).json({status: 'bad'});
    }

    return res.json({status: 'ok'});
});

ArticleRouter.put('/:id', async (req, res) => {
    const {id} = req.params;
    const {title, content} = req.body;

    const a = await Article.findById(id)
        .exec()
        .catch((err) => console.log(err));

    if (!a) {
        return res.status(400).json({status: 'bad'});
    }

    a.content = content;
    a.title = title;
    a.save((err, article) => {
        console.log(err);
        if (!article) {
            return res.status(400).json({status: 'bad'});
        }
        console.log(article);
        return res.json({...article._doc});
    });
});

module.exports = {ArticleRouter};