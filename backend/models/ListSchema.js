import mongoose from "mongoose";
const Schema = mongoose.Schema;

const listSchema = new Schema({
  name: {
    type: String,
    required: [true, 'List name is required'],
    trim: true,
    maxLength: [50, 'List name cannot exceed 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxLength: [200, 'Description cannot exceed 200 characters']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  movies: [{
    movie: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  privacy: {
    type: String,
    enum: ['public', 'private'],
    default: 'private'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isDefault: {
    type: Boolean,
    default: false
  },
  totalMovies: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update totalMovies when movies are added or removed
listSchema.pre('save', function(next) {
  if (this.isModified('movies')) {
    this.totalMovies = this.movies.length;
  }
  next();
});

// Middleware to update updatedAt timestamp
listSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for better query performance
listSchema.index({ user: 1, name: 1 }, { unique: true });
listSchema.index({ privacy: 1 });

const List = mongoose.model('List', listSchema);

export default  List;