const Role = require('../models/Role');
const Category = require('../models/Category');
const Book = require('../models/Book');
const Chapter = require('../models/Chapter');
const { ROLES } = require('../constants');

const seedDatabase = async () => {
  try {
    // 1. Seed Roles
    const rolesCount = await Role.countDocuments();
    if (rolesCount === 0) {
      console.log('Seeding roles...');
      await Role.create([
        {
          name: ROLES.ADMIN,
          description: 'Administrator role with full access permissions'
        },
        {
          name: ROLES.USER,
          description: 'Standard user role with read-write access to private bookmarks and notes'
        }
      ]);
      console.log('Roles seeded successfully.');
    }

    // 2. Seed Categories
    let categories = await Category.find();
    if (categories.length === 0) {
      console.log('Seeding default categories...');
      categories = await Category.create([
        {
          name: 'Bhagavad Gita',
          description: 'The sacred Hindu scripture part of the epic Mahabharata.'
        },
        {
          name: 'Upanishads',
          description: 'The ancient Sanskrit texts of spiritual teaching and ideas of Hinduism.'
        },
        {
          name: 'Vedas',
          description: 'The oldest scriptures of Hinduism, composed in Vedic Sanskrit.'
        },
        {
          name: 'Puranas',
          description: 'Vast genre of Indian literature about a wide range of topics, particularly myths, legends and other traditional lore.'
        }
      ]);
      console.log('Default categories seeded successfully.');
    }

    // 3. Seed a Default Book (Bhagavad Gita)
    const booksCount = await Book.countDocuments();
    if (booksCount === 0) {
      console.log('Seeding a default book...');
      const gitaCategory = await Category.findOne({ name: 'Bhagavad Gita' });
      
      const defaultBook = await Book.create({
        title: 'Bhagavad Gita - As It Is',
        description: 'The largest-selling and most authoritative translation of the Bhagavad Gita.',
        author: 'A. C. Bhaktivedanta Swami Prabhupada',
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
        category: gitaCategory._id,
        tags: ['Gita', 'Mahabharata', 'Krishna', 'Spirituality'],
        isPublished: true
      });
      console.log('Default book seeded successfully.');

      // 4. Seed a Default Chapter
      console.log('Seeding a default chapter...');
      await Chapter.create({
        book: defaultBook._id,
        chapterNumber: 1,
        title: 'Observing the Armies on the Battlefield of Kurukshetra',
        content: 'Dhritarashtra said: O Sanjaya, after assembling in the place of pilgrimage at Kurukshetra, desiring to fight, what did my sons and the sons of Pandu do?',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        isPublished: true
      });
      console.log('Default chapter seeded successfully.');
    }
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
  }
};

module.exports = seedDatabase;
