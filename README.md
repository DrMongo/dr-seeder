# Dr. Seeder

Seed data with ease!



## Use in Node.js
```
npm install dr-seeder
```

## Usage
````js

Seeder.seed('Seed articles from array', ArticlesCollection, {
  data: [
    {title: 'Super cool title', text: 'Hello!'},
    {title: 'Another cool title', text: 'World!'}
  ]
});

// or

Seeder.seed('Seed articles with data callback', ArticlesCollection, {
  data(index) {
    return {title: 'Article ' + index};
  }
});

// or

Seeder.seed('Advanced seed articles', ArticlesCollection, {
  condition() {
    return ArticlesCollection.find().count() < 5
  }
  min: 3,
  max: 10,
  data(index) {
    return {
      title: faker.lorem.words(), 
      text: faker.lorem.paragraph()
    };
  },
  onStart() {
    console.log('Seeder: ' + this.name + ' started');
    return this.collection.find().count();
  },
  onFinish() {
    const count = this.collection.find().count()
    console.log('Seeder: items count increased from ' + this.startResponse + ' to ' + count);
  }

});

````

## Configuration

````js
Seeder.config({ // default values
  condition() { // should data be seeded?
    // this (context) is an Object{name, collection}
    return this.collection.find().count() === 0;
  },
  min: 1, // min rows to be seeded
  max: 20, // max rows to be seeded
  onStart() { // run before seed starts
    // same context as in condition()
    console.log('Seeder: ' + this.name + '\t => Started');
  },
  onFinish() { // run when seed is finished
    // same context as in condition()
    console.log('Seeder: ' + this.name + '\t => Finished');
  },
  onSkip() { // run when seed is skipped (if condition return false)
    // same context as in condition()
    console.log('Seeder: ' + this.name + '\t => Skipped');
  }
})
````

## API
### Seeder.config(options)
Override default settings

### Seeder.seed(name, collection, options)
