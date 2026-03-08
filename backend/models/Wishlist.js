import mongoose from 'mongoose';

/**
 * Wishlist Schema
 * Stores user's wishlist items
 */
const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One wishlist per user
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Calculated fields
    totalItems: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster user lookups
wishlistSchema.index({ user: 1 });

// Calculate totals before saving
wishlistSchema.pre('save', function () {
  this.totalItems = this.items.length;
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;
