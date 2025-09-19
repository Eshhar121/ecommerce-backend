import Product from '../models/Product.js';

// Add a product (publisher only, with Cloudinary image upload)
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
            publisher: req.user.userId,
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

// Get products by logged-in publisher
export const getPublisherProducts = async (req, res) => {
    try {
        const products = await Product.find({ publisher: req.user.userId });
        res.json({ products });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a product (publisher or admin)
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check authorization
        if (req.user.role === 'publisher' && product.publisher.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to update this product' });
        }

        // Handle image update
        if (req.file) {
            product.image = req.file.path;
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        product.category = category || product.category;

        await product.save();

        res.json({ message: 'Product updated', product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update product' });
    }
};

// Delete a product (publisher or admin)
export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check authorization
        if (req.user.role === 'publisher' && product.publisher.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }

        await product.remove();

        res.json({ message: 'Product deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete product' });
    }
};

// Get product stats (admin only)
export const getProductStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        // More stats can be added here
        res.json({ totalProducts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
