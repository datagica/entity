const chai = require('chai')
chai.use(require('chai-fuzzy'))
const expect = chai.expect

const Entity = require("../lib/entity");

describe('Entity', () => {
  describe('creating a single entity', () => {


    it('should not work on garbage', () => {

      const tests = [{
      input: {},
      output: undefined
      }, {
      input: '',
      output: undefined
      }, {
      input: undefined,
      output: undefined
      }, {
      input: null,
      output: undefined
      }, {
      input: 'undefined',
      output: undefined
      }, {
      input: 'null',
      output: undefined
      }, {
      input: '  ',
      output: undefined
      }];

      tests.forEach(test => {
      console.log("\ntest: ", test.input)
      const output = Entity(test.input)
      console.log("output: ", output)
      expect(output).to.be.like(test.output)
      })

    }) // end of should not work on garbage

    it('should work on simple content', () => {

      const tests = [{
      input: true,
      output: { id: 'true', label: 'true', value: true }
      }, {
      input: false,
      output: { id: 'false', label: 'false', value: false }
      }, {
      input: 1,
      output: { id: '1', label: '1', value: 1 }
      }, {
      input: 0,
      output: { id: '0', label: '0', value: 0 }
      }, {
      input: ' Hello World ',
      output: { id: 'hello-world', label: 'Hello World', value: ' Hello World ' }
      }];

      tests.forEach(test => {
      console.log("\ntest: ", test.input)
      const output = Entity(test.input)
      console.log("output: ", output)
      expect(output).to.be.like(test.output)
      })

    }) // end of should work on simple content


    it('should work on perfect objects', () => {

      const tests = [{
      input: { id: 'true', label: 'true', value: 'bar' },
      output: { id: 'true', label: { en: 'true' }, value: 'bar' }
      }, {
      input: { id: 'false', label: 'false', value: false },
      output: { id: 'false', label: { en: 'false' }, value: false }
      }, {
      input: { id: '1', label: '1', value: 1 },
      output: { id: '1', label: { en: '1' }, value: 1 }
      }, {
      input: { id: 'hello-world', label: 'Hello World', value: null },
      output: { id: 'hello-world', label: { en: 'Hello World' }, value: null }
      },
      // test fallback to copying the whole original object as value
      {
      input: { id: '0', label: '0', value: undefined, foo: 'bar' },
      output: { id: '0', label: { en: '0' }, value: { id: '0', label: '0', foo: 'bar'} }
      }];

      tests.forEach(test => {
      console.log("\ntest: ", test.input)
      const output = Entity(test.input)
      console.log("output: ", output)
      expect(output).to.be.like(test.output)
      })

    }) // end of should work on perfect objects

    it('should work with common fallbacks', () => {

      const tests = [
      // fallback to using 'id' only
      {
      input: { id: 'true' },
      output: { id: 'true', label: { en: 'true' }, value: { id: 'true' } }
      },{
      input: { id: 'True' },
      output: { id: 'true', label: { en: 'True' }, value: { id: 'True' } }
      },

      // fallback to using 'label' only
      {
      input: { label: 'true' },
      output: { id: 'true', label: { en: 'true' }, value: { label: 'true' } }
      },{
      input: { label: 'True' },
      output: { id: 'true', label: { en: 'True' }, value: { label: 'True' } }
      },

      // fallback to using 'name' only
      {
      input: { name: 'true' },
      output: { id: 'true', label: { en: 'true' }, value: { name: 'true' } }
      },{
      input: { name: 'True' },
      output: { id: 'true', label: { en: 'True' }, value: { name: 'True' } }
      },

      // fallback to using 'title' only
      {
      input: { title: 'true' },
      output: { id: 'true', label: { en: 'true' }, value: { title: 'true' } }
      },{
      input: { title: 'True' },
      output: { id: 'true', label: { en: 'True' }, value: { title: 'True' } }
      }

      ];

      tests.forEach(test => {
      console.log("\ntest: ", test.input)
      const output = Entity(test.input)
      console.log("output: ", output)
      expect(output).to.be.like(test.output)
      })

    }) // end of should work with common fallbacks



    it('should work with translation blocks', () => {

      const tests = [
      {
        input: {
          label: {
            en: 'Truck',
            fr: 'Camion'
          }
        },
        output: {
          id: 'truck',
          label: {
            en: 'Truck',
            fr: 'Camion'
          },
          value: {
            label: {
              en: 'Truck',
              fr: 'Camion'
            }
          }
        }
      }
      ];

      tests.forEach(test => {
      console.log("\ntest: ", test.input)
      const output = Entity(test.input)
      console.log("output: ", output)
      expect(output).to.be.like(test.output)
      })

    }) // end of should work with common fallbacks

  }) // end of single entity


})
