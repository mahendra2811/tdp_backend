import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Blog from '../models/Blog';
import { connectDB } from '../config/database';

// Load environment variables
dotenv.config();

// Sample blog data
const blogData = [
  {
    title: 'Wildlife Photography Tips in Thar Desert',
    slug: 'wildlife-photography-tips-thar-desert',
    description: 'Learn essential tips and techniques for capturing stunning wildlife photographs in the Thar Desert ecosystem.',
    content: `
      <h2>Introduction to Wildlife Photography in Thar Desert</h2>
      <p>The Thar Desert, also known as the Great Indian Desert, is home to a diverse range of wildlife species that have adapted to the harsh desert conditions. From the endangered Great Indian Bustard to various species of reptiles, birds, and mammals, the desert offers unique photography opportunities.</p>
      
      <h2>Essential Equipment</h2>
      <p>When photographing wildlife in the Thar Desert, it's important to have the right equipment:</p>
      <ul>
        <li>A DSLR or mirrorless camera with good low-light performance</li>
        <li>Telephoto lenses (200-600mm range)</li>
        <li>A sturdy tripod to stabilize your shots</li>
        <li>Protective gear for your equipment against sand and dust</li>
        <li>Extra batteries and memory cards</li>
      </ul>
      
      <h2>Best Time for Wildlife Photography</h2>
      <p>The golden hours of early morning and late afternoon provide the best lighting conditions for wildlife photography in the desert. Many desert animals are also more active during these cooler periods of the day.</p>
      
      <h2>Composition Techniques</h2>
      <p>When composing your wildlife shots in the desert:</p>
      <ul>
        <li>Include the desert landscape to tell a more complete story</li>
        <li>Use the rule of thirds to create balanced compositions</li>
        <li>Capture animals in their natural behaviors</li>
        <li>Look for interesting patterns in the sand or vegetation</li>
      </ul>
      
      <h2>Patience is Key</h2>
      <p>Wildlife photography requires patience. Sometimes you might need to wait for hours to get the perfect shot. The desert can be unpredictable, but the rewards are worth the wait.</p>
      
      <h2>Ethical Considerations</h2>
      <p>Always prioritize the welfare of the animals and their habitat:</p>
      <ul>
        <li>Maintain a safe distance from wildlife</li>
        <li>Never disturb or chase animals for a photograph</li>
        <li>Follow park rules and regulations</li>
        <li>Consider joining guided tours with experienced naturalists</li>
      </ul>
      
      <h2>Post-Processing Tips</h2>
      <p>When editing your desert wildlife photos:</p>
      <ul>
        <li>Enhance the natural colors of the desert</li>
        <li>Adjust contrast to bring out details</li>
        <li>Remove sensor dust spots that are common in desert environments</li>
        <li>Consider the mood you want to convey</li>
      </ul>
      
      <p>With these tips and techniques, you'll be well-equipped to capture stunning wildlife photographs in the Thar Desert. Remember that each photography session is a learning experience, and the more time you spend in the field, the better your skills will become.</p>
    `,
    coverImage: '/assets/Images/birds/birds-1.JPG',
    author: 'Thar Desert Photography Team',
    tags: ['wildlife', 'photography', 'tips', 'thar desert'],
    publishedDate: new Date('2023-10-15'),
    isPublished: true
  },
  {
    title: 'The Great Indian Bustard: A Conservation Story',
    slug: 'great-indian-bustard-conservation-story',
    description: 'Discover the conservation efforts to save the critically endangered Great Indian Bustard in the Thar Desert region.',
    content: `
      <h2>The Great Indian Bustard: A Majestic Desert Dweller</h2>
      <p>The Great Indian Bustard (Ardeotis nigriceps) is one of the heaviest flying birds in the world and is endemic to the Indian subcontinent. Once widespread across the grasslands of India, this magnificent bird is now critically endangered with fewer than 150 individuals remaining in the wild.</p>
      
      <h2>Current Status</h2>
      <p>The Thar Desert region, particularly the Desert National Park, is one of the last strongholds of the Great Indian Bustard. The bird faces numerous threats:</p>
      <ul>
        <li>Habitat loss due to agricultural expansion</li>
        <li>Collision with power lines and wind turbines</li>
        <li>Hunting and poaching</li>
        <li>Low breeding success</li>
      </ul>
      
      <h2>Conservation Initiatives</h2>
      <p>Several conservation programs are currently underway to save this iconic species:</p>
      
      <h3>Project Great Indian Bustard</h3>
      <p>Launched by the Government of India, this project focuses on habitat improvement, protection of breeding sites, and community involvement in conservation efforts.</p>
      
      <h3>Captive Breeding Program</h3>
      <p>The Wildlife Institute of India has established a captive breeding facility to increase the population of Great Indian Bustards. The program has seen some success with the hatching of chicks in controlled environments.</p>
      
      <h3>Power Line Mitigation</h3>
      <p>Efforts are being made to bury power lines or install bird diverters in critical Great Indian Bustard habitats to prevent collision-related mortalities.</p>
      
      <h2>The Role of Ecotourism</h2>
      <p>Responsible ecotourism can play a significant role in Great Indian Bustard conservation by:</p>
      <ul>
        <li>Raising awareness about the species' plight</li>
        <li>Providing economic incentives for local communities to protect the bird</li>
        <li>Generating funds for conservation initiatives</li>
      </ul>
      
      <h2>How You Can Help</h2>
      <p>There are several ways you can contribute to Great Indian Bustard conservation:</p>
      <ul>
        <li>Support organizations working for bustard conservation</li>
        <li>Spread awareness about the species through social media and other platforms</li>
        <li>Practice responsible wildlife tourism</li>
        <li>Advocate for policies that protect grassland habitats</li>
      </ul>
      
      <h2>Success Stories</h2>
      <p>Despite the challenges, there have been some positive developments in recent years:</p>
      <ul>
        <li>Increased sightings in protected areas</li>
        <li>Successful hatching of eggs in the captive breeding program</li>
        <li>Greater public awareness and support for conservation</li>
      </ul>
      
      <p>The Great Indian Bustard is not just a bird; it's a symbol of India's grassland ecosystem. Its conservation is crucial not only for the species itself but for the entire ecological community it represents. With concerted efforts from government agencies, conservation organizations, and the public, there is hope for the survival of this magnificent bird.</p>
    `,
    coverImage: '/assets/Images/GIB-1.jpg',
    author: 'Thar Desert Photography Team',
    tags: ['great indian bustard', 'conservation', 'endangered species', 'thar desert'],
    publishedDate: new Date('2023-11-20'),
    isPublished: true
  },
  {
    title: 'Desert National Park: A Biodiversity Hotspot',
    slug: 'desert-national-park-biodiversity-hotspot',
    description: 'Explore the rich biodiversity of Desert National Park, one of India\'s most unique protected areas in the heart of the Thar Desert.',
    content: `
      <h2>Introduction to Desert National Park</h2>
      <p>Spread across 3162 square kilometers in the heart of the Thar Desert, Desert National Park (DNP) is one of India's largest national parks. Despite its arid landscape, the park is a surprising biodiversity hotspot that supports a variety of desert-adapted flora and fauna.</p>
      
      <h2>Unique Ecosystem</h2>
      <p>The park represents the Thar Desert ecosystem with its unique physical and biological characteristics:</p>
      <ul>
        <li>Rolling sand dunes</li>
        <li>Craggy rocks and compact salt lake bottoms</li>
        <li>Intermediate areas and fixed dunes</li>
        <li>Desert vegetation adapted to extreme conditions</li>
      </ul>
      
      <h2>Flora of Desert National Park</h2>
      <p>Despite the harsh conditions, the park supports a variety of plant species:</p>
      <ul>
        <li>Aak (Calotropis procera)</li>
        <li>Khejri (Prosopis cineraria)</li>
        <li>Thor (Euphorbia caducifolia)</li>
        <li>Kair (Capparis decidua)</li>
        <li>Various grasses and herbs that come alive after rainfall</li>
      </ul>
      
      <h2>Avian Diversity</h2>
      <p>The park is a haven for bird watchers with over 150 resident and migratory bird species:</p>
      <ul>
        <li>Great Indian Bustard - the park's flagship species</li>
        <li>Cream-colored Courser</li>
        <li>Houbara Bustard</li>
        <li>Demoiselle Crane</li>
        <li>Eagles, harriers, falcons, and kestrels</li>
        <li>Sandgrouse and desert larks</li>
      </ul>
      
      <h2>Mammals of the Desert</h2>
      <p>The park is home to several desert-adapted mammals:</p>
      <ul>
        <li>Desert Fox</li>
        <li>Desert Cat</li>
        <li>Chinkara (Indian Gazelle)</li>
        <li>Blackbuck</li>
        <li>Indian Wolf</li>
        <li>Desert Hare</li>
      </ul>
      
      <h2>Reptilian Wonders</h2>
      <p>Reptiles thrive in the desert conditions, and the park hosts several species:</p>
      <ul>
        <li>Spiny-tailed Lizard</li>
        <li>Monitor Lizard</li>
        <li>Saw-scaled Viper</li>
        <li>Sandfish</li>
        <li>Various agamids and geckos</li>
      </ul>
      
      <h2>Conservation Challenges</h2>
      <p>Despite its protected status, Desert National Park faces several challenges:</p>
      <ul>
        <li>Grazing pressure from livestock</li>
        <li>Invasive species like Prosopis juliflora</li>
        <li>Wind and solar energy projects in the vicinity</li>
        <li>Climate change impacts</li>
      </ul>
      
      <h2>Visitor Information</h2>
      <p>For those interested in exploring this unique ecosystem:</p>
      <ul>
        <li>Best time to visit: October to March</li>
        <li>Nearest town: Jaisalmer (about 40 km)</li>
        <li>Guided tours available for wildlife spotting</li>
        <li>Photography permits required for professional photography</li>
      </ul>
      
      <p>Desert National Park stands as a testament to nature's resilience and adaptability. It reminds us that life can flourish even in the harshest conditions, making it a must-visit destination for nature enthusiasts and wildlife photographers alike.</p>
    `,
    coverImage: '/assets/Images/DNP/DNP-1.jpg',
    author: 'Thar Desert Photography Team',
    tags: ['desert national park', 'biodiversity', 'wildlife', 'thar desert', 'conservation'],
    publishedDate: new Date('2023-12-05'),
    isPublished: true
  }
];

// Connect to the database
const seedBlogs = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    // Delete existing blogs
    await Blog.deleteMany({});
    console.log('Existing blogs deleted');

    // Insert new blogs
    const createdBlogs = await Blog.insertMany(blogData);
    console.log(`${createdBlogs.length} blogs created`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding blogs:', error);
    process.exit(1);
  }
};

// Run the seed function
seedBlogs();