class Seed {

  constructor(name, collection, options ) {
    if ( !collection || !options ) {
      var msg = 'Please supply a collection to seed and options for seeding.';
      throw new Error( msg );
    } else {
      this.name = name;
      this.collection = collection;
      this.options = options;
      this.isDataArray = this.options.data instanceof Array;
      this.context = {
        name,
        collection,
        startResponse: null
      };

      this.seed();
    }
  }

  shouldSeed() {
    let condition = this.options.condition;

    return condition ? condition.call(this.context) : true;
  }

  seed() {
    let options = this.options;
    let data = options.data;
    let onStart = options.onStart;
    let onFinish = options.onFinish;
    let onSkip = options.onSkip;


    if (this.shouldSeed()) {
      if (onStart) {
        this.context.startResponse = onStart.call(this.context);
      }

      this.plant(data);

      if (onFinish) {
        onFinish.call(this.context);
      }
    } else if (onSkip) {
      onSkip.call(this.context);
    }
  }

  plant( data ) {
    let loopLength = this._loopLength();

    for ( let i = 0; i < loopLength; i++ ) {
      let value = this.isDataArray ? data[i] : data.call(this.context, i);

      this.collection.insert( value );
    }
  }

  _loopLength() {
    const random = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    return this.isDataArray ?
      this.options.data.length :
      random(this.options.min, this.options.max);
  }
}

const Seeder = {
  settings: {
    condition() {
      return this.collection.find().count() === 0;
    },
    min: 1,
    max: 20,
    onStart() {
      console.log('Seeder: ' + this.name + '\t => Started');
    },
    onFinish() {
      console.log('Seeder: ' + this.name + '\t => Finished');
    },
    onSkip() {
      console.log('Seeder: ' + this.name + '\t => Skipped');
    }
  },

  config(options) {
    Object.assign(this.settings, options);
  },

  seed(name, collection, options) {
    const finalOptions = Object.assign({}, this.settings, options);
    return new Seed( name, collection, finalOptions );
  }
};

export default Seeder;
