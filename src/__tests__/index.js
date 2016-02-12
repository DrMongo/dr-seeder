import {expect} from 'chai';
import Seeder from '../';
const {describe, it} = global;

class Collection {
  constructor() {
    this.list = [];
  }

  insert(data) {
    this.list.push(data);
  }

  find() {
    const length = this.list.length;
    return {
      count() {
        return length;
      }
    };
  }

  // helpers
  _reset() {
    this.list = [];
  }

  _count() {
    return this.list.length;
  }
}


describe('Data as array', () => {

  it('check seeded data', () => {
    const collection = new Collection();

    Seeder.seed('Data as array', collection, {
      data: [
        {name: 'foo1'},
        {name: 'foo2'}
      ]
    });

    expect(collection).to.have.deep.property('list[0].name', 'foo1');
    expect(collection).to.have.deep.property('list[1].name', 'foo2');
  });


  it('custom condition', () => {
    const collection = new Collection();

    Seeder.seed('custom condition', collection, {
      condition() {
        return true;
      },
      data: [ {key: 'value'} ]
    });

    expect(collection._count()).to.be.equal(1);
    expect(collection).to.have.deep.property('list[0].key', 'value');
  });

});


describe('Data as function', () => {
  const collection = new Collection();

  Seeder.seed('Data as function', collection, {
    min: 3,
    max: 10,
    data: index => {
      return {title: 'Article ' + index};
    }
  });


  it('check seeded data count', () => {
    expect(collection._count()).to.be.least(3);
    expect(collection._count()).to.be.most(10);
  });

  it('check seeded data', () => {
    expect(collection).to.have.deep.property('list[0].title', 'Article 0');
    expect(collection).to.have.deep.property('list[1].title', 'Article 1');
  });
});


describe('Lifecycle callbacks', () => {

  it('start and finish with context check', () => {
    const collection = new Collection();

    let stack = [];
    Seeder.seed('seed with lifecycle callbacks', collection, {
      data: [ {key: 'value'} ],
      onStart() {
        stack.push('start');
        expect(this.name).to.be.equal('seed with lifecycle callbacks');
        expect(this.collection).to.be.equal(collection);
        return 'start return data';
      },
      onFinish() {
        expect(this.name).to.be.equal('seed with lifecycle callbacks');
        expect(this.collection).to.be.equal(collection);
        expect(this.startResponse).to.be.equal('start return data');
        stack.push('finish');
      },
      onSkip() {
        stack.push('skip');
      }
    });

    expect(stack.join(';')).to.be.equal('start;finish');
  });

  it('start and skip with context check', () => {
    const collection = new Collection();
    collection.insert({key: 'already seeded collection'});

    let stack = [];
    Seeder.seed('seed with lifecycle callbacks', collection, {
      data: [ {key: 'value'} ],
      onStart() {
        stack.push('start');
      },
      onFinish() {
        stack.push('finish');
      },
      onSkip() {
        expect(this.name).to.be.equal('seed with lifecycle callbacks');
        expect(this.collection).to.be.equal(collection);
        expect(this.startResponse).to.be.equal(null);
        stack.push('skip');
      }
    });

    expect(stack.join(';')).to.be.equal('skip');
  });

});
