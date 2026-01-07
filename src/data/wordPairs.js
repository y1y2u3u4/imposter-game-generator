/**
 * Word Pairs Database for Imposter Game
 * Each category contains pairs of similar but different words
 * Format: [civilianWord, imposterWord]
 */

export const wordPairs = {
  animals: [
    ["Dog", "Wolf"],
    ["Cat", "Tiger"],
    ["Rabbit", "Hare"],
    ["Dolphin", "Shark"],
    ["Bee", "Wasp"],
    ["Butterfly", "Moth"],
    ["Crow", "Raven"],
    ["Turtle", "Tortoise"],
    ["Seal", "Sea Lion"],
    ["Alligator", "Crocodile"],
    ["Monkey", "Ape"],
    ["Frog", "Toad"],
    ["Mouse", "Rat"],
    ["Donkey", "Mule"],
    ["Goose", "Duck"],
    ["Leopard", "Cheetah"],
    ["Buffalo", "Bison"],
    ["Llama", "Alpaca"],
    ["Hawk", "Eagle"],
    ["Pigeon", "Dove"],
    ["Panther", "Jaguar"],
    ["Salmon", "Trout"],
    ["Crab", "Lobster"],
    ["Octopus", "Squid"],
    ["Hamster", "Gerbil"],
    ["Penguin", "Puffin"],
    ["Parrot", "Macaw"],
    ["Owl", "Eagle"],
    ["Elephant", "Mammoth"],
    ["Horse", "Zebra"],
  ],

  food: [
    ["Pizza", "Flatbread"],
    ["Burger", "Sandwich"],
    ["Sushi", "Sashimi"],
    ["Coffee", "Espresso"],
    ["Cake", "Pie"],
    ["Ice Cream", "Gelato"],
    ["Pasta", "Noodles"],
    ["Butter", "Margarine"],
    ["Jam", "Jelly"],
    ["Ketchup", "Tomato Sauce"],
    ["Chips", "Crisps"],
    ["Soup", "Stew"],
    ["Pancake", "Waffle"],
    ["Muffin", "Cupcake"],
    ["Lemonade", "Limeade"],
    ["Hot Dog", "Sausage"],
    ["Taco", "Burrito"],
    ["Croissant", "Danish"],
    ["Yogurt", "Pudding"],
    ["Bread", "Toast"],
    ["Bacon", "Ham"],
    ["Shrimp", "Prawn"],
    ["Biscuit", "Cookie"],
    ["Smoothie", "Milkshake"],
    ["Salad", "Coleslaw"],
    ["Chocolate", "Cocoa"],
    ["Honey", "Syrup"],
    ["Mustard", "Mayo"],
    ["Popcorn", "Corn"],
    ["Donut", "Bagel"],
  ],

  objects: [
    ["Phone", "Tablet"],
    ["Pen", "Pencil"],
    ["Chair", "Stool"],
    ["Couch", "Sofa"],
    ["Watch", "Clock"],
    ["Mirror", "Glass"],
    ["Pillow", "Cushion"],
    ["Bag", "Purse"],
    ["Lamp", "Light"],
    ["Cup", "Mug"],
    ["Plate", "Bowl"],
    ["Fork", "Spoon"],
    ["Scissors", "Knife"],
    ["Brush", "Comb"],
    ["Soap", "Shampoo"],
    ["Towel", "Napkin"],
    ["Book", "Magazine"],
    ["Newspaper", "Newsletter"],
    ["Box", "Crate"],
    ["Rope", "String"],
    ["Key", "Lock"],
    ["Bell", "Alarm"],
    ["Candle", "Torch"],
    ["Blanket", "Sheet"],
    ["Curtain", "Blind"],
    ["Carpet", "Rug"],
    ["Wallet", "Purse"],
    ["Umbrella", "Parasol"],
    ["Glasses", "Sunglasses"],
    ["Hat", "Cap"],
  ],

  places: [
    ["Beach", "Shore"],
    ["Mountain", "Hill"],
    ["Lake", "Pond"],
    ["Ocean", "Sea"],
    ["Forest", "Jungle"],
    ["Desert", "Sahara"],
    ["City", "Town"],
    ["Village", "Hamlet"],
    ["Park", "Garden"],
    ["Museum", "Gallery"],
    ["Library", "Bookstore"],
    ["Hospital", "Clinic"],
    ["Restaurant", "Cafe"],
    ["Hotel", "Motel"],
    ["Airport", "Station"],
    ["School", "University"],
    ["Church", "Temple"],
    ["Stadium", "Arena"],
    ["Theater", "Cinema"],
    ["Mall", "Market"],
    ["Bridge", "Tunnel"],
    ["Island", "Peninsula"],
    ["Cave", "Cavern"],
    ["Valley", "Canyon"],
    ["River", "Stream"],
    ["Waterfall", "Fountain"],
    ["Castle", "Palace"],
    ["Farm", "Ranch"],
    ["Zoo", "Aquarium"],
    ["Gym", "Spa"],
  ],

  actions: [
    ["Walk", "Run"],
    ["Jump", "Hop"],
    ["Swim", "Dive"],
    ["Sing", "Hum"],
    ["Dance", "Sway"],
    ["Write", "Draw"],
    ["Read", "Scan"],
    ["Cook", "Bake"],
    ["Cut", "Slice"],
    ["Push", "Pull"],
    ["Throw", "Toss"],
    ["Catch", "Grab"],
    ["Kick", "Punch"],
    ["Whisper", "Murmur"],
    ["Shout", "Scream"],
    ["Laugh", "Giggle"],
    ["Cry", "Sob"],
    ["Sleep", "Nap"],
    ["Eat", "Chew"],
    ["Drink", "Sip"],
    ["Talk", "Chat"],
    ["Listen", "Hear"],
    ["Watch", "Observe"],
    ["Touch", "Feel"],
    ["Smell", "Sniff"],
    ["Think", "Ponder"],
    ["Dream", "Imagine"],
    ["Work", "Labor"],
    ["Play", "Game"],
    ["Rest", "Relax"],
  ],
}

export const categoryLabels = {
  animals: "Animals",
  food: "Food & Drinks",
  objects: "Everyday Objects",
  places: "Places",
  actions: "Actions & Verbs",
}

export const categoryEmojis = {
  animals: "🐾",
  food: "🍕",
  objects: "📱",
  places: "🏝️",
  actions: "🏃",
}

/**
 * Get a random word pair from a category
 * @param {string} category - Category name
 * @returns {[string, string]} - [civilianWord, imposterWord]
 */
export function getRandomPair(category) {
  const pairs = wordPairs[category]
  if (!pairs) {
    // Random category if invalid
    const categories = Object.keys(wordPairs)
    category = categories[Math.floor(Math.random() * categories.length)]
  }
  return pairs[Math.floor(Math.random() * pairs.length)]
}

/**
 * Get all categories
 * @returns {string[]}
 */
export function getCategories() {
  return Object.keys(wordPairs)
}
