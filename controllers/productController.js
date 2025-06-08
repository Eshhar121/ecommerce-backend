import Product from '../models/Product.js';

// Add a product (admin only, with Cloudinary image upload)
export const addProduct = async (req, res) => {
    const { name, description, price, stock, category } = req.body;

    // Basic backend validation
    if (!name || !description || !price || !stock) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const existing = await Product.findOne({ name, category });

        if (existing) {
            return res.status(409).json({ message: 'Product already exists in this category' });
        }

        // Handle image upload via Cloudinary
        const image = req.file?.path || ''; // optional: fallback to default image path if needed

        const newProduct = new Product({
            name,
            description,
            image,
            price,
            stock,
            category,
        });

        await newProduct.save();

        res.status(201).json({ message: 'Product created', product: newProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create product' });
    }
};

// Get products by search / pagination
export const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const query = search
            ? { name: { $regex: search, $options: 'i' } }
            : {};

        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            products,
            page,
            totalPages: Math.ceil(total / limit),
            totalProducts: total,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
